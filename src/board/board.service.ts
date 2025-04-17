import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BoardMaster } from './board.model';
import { ListMaster } from 'src/list/list.model';
import { User } from 'src/user/user.model';
import { BoardDto } from './dto/board.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(BoardMaster)
    private boardModel: typeof BoardMaster,
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
  }
}
