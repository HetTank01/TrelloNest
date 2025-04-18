import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CardMaster } from './card.model';
import { CardDto } from './dto/card.dto';
import { ListMaster } from 'src/list/list.model';

@Injectable()
export class CardService {
  constructor(
    @InjectModel(CardMaster) private cardModel: typeof CardMaster,
    @InjectModel(ListMaster) private listModel: typeof ListMaster,
  ) {}

  async getAllCards(listId: number): Promise<CardMaster[]> {
    const cards = await this.cardModel.findAll({
      where: { ListMasterId: listId },
      order: [['position', 'ASC']],
    });

    return cards;
  }

  async createCard(cardData: CardDto): Promise<CardMaster> {
    const card = await this.cardModel.create({ cardData });
    return card;
  }

  async updateCard(cardId: number, cardData: CardDto): Promise<CardMaster> {
    const card = await this.cardModel.findByPk(cardId);

    if (!card) {
      throw new Error('Card not found');
    }

    await card.update(cardData);

    return card;
  }

  async deleteCard(cardId: number): Promise<void> {
    const card = await this.cardModel.findByPk(cardId);

    if (!card) {
      throw new Error('Card not found');
    }

    await card.destroy();
  }

  async moveCardBetweenLists(
    cardId: number,
    targetListId: number,
    position: number,
  ): Promise<void> {
    const card = await this.cardModel.findByPk(cardId);
    if (!card) {
      throw new Error('Card not found');
    }

    const list = await this.listModel.findByPk(targetListId);
    if (!list) {
      throw new Error('Target list not found');
    }

    await card.update({
      ListMasterId: targetListId,
      position,
    });
  }
}
