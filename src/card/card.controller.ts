import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CardDto } from './dto/card.dto';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  // Get all cards by list ID
  @Get('list/:listId')
  async getAllCards(@Param('listId', ParseIntPipe) listId: number) {
    const cards = await this.cardService.getAllCards(listId);
    return cards;
  }

  // Create a new card
  @Post()
  async createCard(@Body() cardData: CardDto) {
    const card = await this.cardService.createCard(cardData);
    return {
      message: 'Card created successfully',
      data: card,
    };
  }

  // Update a card
  @Put(':cardId')
  async updateCard(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body() cardData: CardDto,
  ) {
    const card = await this.cardService.updateCard(cardId, cardData);
    return {
      message: 'Card updated successfully',
      data: card,
    };
  }

  // Delete a card
  @Delete(':cardId')
  async deleteCard(@Param('cardId', ParseIntPipe) cardId: number) {
    await this.cardService.deleteCard(cardId);
    return {
      message: 'Card deleted successfully',
    };
  }

  // Move card to another list
  @Put(':cardId/move')
  async moveCardBetweenLists(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body('targetListId', ParseIntPipe) targetListId: number,
    @Body('position', ParseIntPipe) position: number,
  ) {
    try {
      await this.cardService.moveCardBetweenLists(
        cardId,
        targetListId,
        position,
      );
      return {
        message: 'Card moved successfully between lists',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
