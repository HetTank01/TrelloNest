import jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BoardMaster } from './board.model';
import { ListMaster } from 'src/list/list.model';
import { User } from 'src/user/user.model';
import { BoardDto } from './dto/board.dto';
import { CardMaster } from 'src/card/card.model';
import { Op } from 'sequelize';
import { ShareBoardInterface } from './board.interface';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(BoardMaster)
    private boardModel: typeof BoardMaster,
    private mailService: MailService,
  ) {}

  async getAll(userId: number): Promise<BoardMaster[]> {
    const boards = await this.boardModel.findAll({
      where: { userId },
      include: [
        {
          model: ListMaster,
        },
      ],
    });

    return boards;
  }

  async create(userId: number, boardData: BoardDto): Promise<BoardMaster> {
    const isUserExist = await User.findByPk(userId);

    if (!isUserExist) {
      throw new Error('User not found');
    }

    const board = await this.boardModel.create({
      ...boardData,
      UserMasterId: userId,
    });

    const freshUser = await User.findByPk(userId);

    let currentBoards = freshUser?.shared_boards || 0;

    if (Array.isArray(currentBoards)) {
      currentBoards = [];
    }

    const boardId = Number(board.id) || board.id;

    if (!currentBoards.includes(boardId)) {
      currentBoards.push(boardId);
    }

    await User.update(
      { shared_boards: currentBoards },
      { where: { id: userId } },
    );

    return board;
  }

  async update(id: number, boardData: BoardDto): Promise<BoardMaster> {
    const board = await this.boardModel.findByPk(id);

    if (!board) {
      throw new Error('Board not found');
    }

    await board.update(boardData);

    return board;
  }

  async delete(id: number): Promise<void> {
    const board = await this.boardModel.findByPk(id);

    if (!board) {
      throw new Error('Board not found');
    }

    const allusers = await User.findAll();

    const filteredUsers = allusers.filter(async (user) => {
      const sharedBoards = user.shared_boards || [];

      if (sharedBoards.includes(board.id)) {
        const updatedSharedBoards = sharedBoards.filter(
          (boardId) => boardId !== board.id,
        );
        await User.update(
          { shared_boards: updatedSharedBoards },
          { where: { id: user.id } },
        );
      }

      await Promise.all(filteredUsers);

      const lists = await ListMaster.findAll({ where: { BoardMasterId: id } });
      const listIds = lists.map((list) => list.id);

      if (listIds.length > 0) {
        const cards = await CardMaster.findAll({
          where: { ListMasterId: listIds },
        });
        await Promise.all(cards.map((card) => card.destroy()));
      }

      await Promise.all(lists.map((list) => list.destroy()));
      await board.destroy();

      return true;
    });
  }

  async getBoardSharedWithYou(userId: number): Promise<BoardMaster[]> {
    const isUserExist = await User.findByPk(userId);

    if (!isUserExist) {
      throw new Error('User not found');
    }

    const sharedBoards = isUserExist.shared_boards || [];

    if (!Array.isArray(sharedBoards) || sharedBoards.length === 0) {
      throw new Error('No shared boards found');
    }

    const findBoards = await this.boardModel.findAll({
      where: { id: { [Op.in]: sharedBoards } },
      include: [
        {
          model: User,
          where: { id: { [Op.ne]: userId } },
        },
        {
          model: ListMaster,
          include: [
            {
              model: CardMaster,
            },
          ],
        },
      ],
    });

    return findBoards;
  }

  async shareBoard(reqBody: ShareBoardInterface) {
    const { BoardMasterId, email, role } = reqBody;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('User not found');
    }

    const board = await this.boardModel.findByPk(BoardMasterId);

    if (!board) {
      throw new Error('Board not found');
    }

    if (
      user.shared_boards.includes(Number(BoardMasterId)) ||
      user.shared_boards.includes(BoardMasterId)
    ) {
      throw new Error('Board already shared with this user');
    }

    const token = jwt.sign(
      { BoardMasterId: BoardMasterId, email, role },
      'this-is-a-secret-key',
      { expiresIn: '24h' },
    );

    const inviteLink = `http://localhost:5173/invite?token=${token}`;

    await this.mailService.sendMail(email, 'Welcome to My App', inviteLink);

    return inviteLink;
  }

  async validateInvite(token: string) {
    try {
      const decoded = jwt.verify(token, 'this-is-a-secret-key');
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  async acceptInvite(token: string) {
    try {
      const decoded = jwt.verify(token, 'this-is-a-secret-key');
      const { BoardMasterId, email, role } = decoded as ShareBoardInterface;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new Error('User not found');
      }

      let sharedBoard = user.shared_boards;

      if (!Array.isArray(sharedBoard)) {
        sharedBoard = [];
      }

      if (
        sharedBoard.includes(Number(BoardMasterId)) ||
        sharedBoard.includes(BoardMasterId)
      ) {
        throw new Error('Board already shared with this user');
      }

      sharedBoard.push(BoardMasterId);

      await User.update(
        { shared_boards: sharedBoard },
        { where: { id: user.id } },
      );

      return 'Access granted to the board';
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expired. Please request a new one.');
      }

      throw new Error('Invalid token. Please check the link.');
    }
  }

  async updateListPosision(boardId: number, lists: any[]) {
    await Promise.all(
      lists.map(async (list) => {
        await ListMaster.update(
          { position: list.position },
          { where: { id: list.id, BoardMasterId: boardId } },
        );
      }),
    );

    return 'List positions updated successfully';
  }
}
