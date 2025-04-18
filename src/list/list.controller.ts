// src/list/list.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ListService } from './list.service';
import { ListDto } from './dto/list.dto';
import { CardPositionDto } from './dto/cardPosition.dto';
import { ListMaster } from './list.model';

@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get(':boardId')
  async getAllLists(
    @Param('boardId', ParseIntPipe) boardId: number,
  ): Promise<ListMaster[]> {
    return this.listService.getAll(boardId);
  }

  @Post()
  async createList(@Body() listDto: ListDto): Promise<ListMaster> {
    return this.listService.create(listDto);
  }

  @Put(':id')
  async updateList(
    @Param('id', ParseIntPipe) id: number,
    @Body() listDto: ListDto,
  ): Promise<ListMaster> {
    return this.listService.update(id, listDto);
  }

  @Delete(':id')
  async deleteList(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.listService.delete(id);
  }

  @Put(':listId/cards/positions')
  async updateCardPositions(
    @Param('listId', ParseIntPipe) listId: number,
    @Body() cards: CardPositionDto[],
  ): Promise<void> {
    return this.listService.updateCardPosition(listId, cards);
  }
}
