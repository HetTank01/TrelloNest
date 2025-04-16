import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BoardMaster } from './board.model';
import { ListMaster } from 'src/list/list.model';

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
}
