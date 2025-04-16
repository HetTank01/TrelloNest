import { Controller, Get, Query } from '@nestjs/common';
import { BoardService } from './board.service';

@Controller('board')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Get()
  findAll(@Query('userId') userId: string) {
    return this.boardService.getAll(Number(userId));
  }
}
