import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ListMaster } from './list.model';
import { ListDto } from './dto/list.dto';
import { CardMaster } from 'src/card/card.model';
import { CardPositionDto } from './dto/cardPosition.dto';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(ListMaster)
    private listModel: typeof ListMaster,
  ) {}

  async getAll(boardId: number): Promise<ListMaster[]> {
    const lists = await this.listModel.findAll({
      where: { boardId },
      order: [['position', 'ASC']],
    });

    return lists;
  }

  async create(listData: ListDto): Promise<ListMaster> {
    const list = await this.listModel.create({ listData });

    return list;
  }

  async update(listId: number, listData: ListDto): Promise<ListMaster> {
    const list = await this.listModel.findByPk(listId);

    if (!list) {
      throw new Error('List not found');
    }

    await list.update(listData);

    return list;
  }

  async delete(listId: number): Promise<void> {
    const list = await this.listModel.findByPk(listId);

    if (!list) {
      throw new Error('List not found');
    }

    const cards = await CardMaster.findAll({
      where: { ListMasterId: list.id },
    });

    await Promise.all(cards.map((card) => card.destroy()));
    await list.destroy();
  }

  async updateCardPosition(
    listId: number,
    cards: CardPositionDto[],
  ): Promise<void> {
    await Promise.all(
      cards.map(async (card) => {
        await CardMaster.update(
          { position: card.position },
          { where: { id: card.id, ListMasterId: listId } },
        );
      }),
    );
  }
}
