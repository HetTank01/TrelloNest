import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardDto } from './dto/board.dto';
import { BoardMaster } from './board.model';
import { ShareBoardInterface } from './board.interface';

@Controller('board')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Get()
  async getAllBoards(@Query('userId') userId: number): Promise<BoardMaster[]> {
    try {
      return await this.boardService.getAll(userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  async createBoard(
    @Body('userId') userId: number,
    @Body() boardData: BoardDto,
  ): Promise<BoardMaster> {
    try {
      return await this.boardService.create(userId, boardData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async updateBoard(
    @Param('id') id: number,
    @Body() boardData: BoardDto,
  ): Promise<BoardMaster> {
    try {
      return await this.boardService.update(id, boardData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async deleteBoard(@Param('id') id: number): Promise<{ message: string }> {
    try {
      await this.boardService.delete(id);
      return { message: 'Board deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('shared')
  async getBoardSharedWithYou(
    @Query('userId') userId: number,
  ): Promise<BoardMaster[]> {
    try {
      return await this.boardService.getBoardSharedWithYou(userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('share')
  async shareBoard(
    @Body() shareData: ShareBoardInterface,
  ): Promise<{ inviteLink: string }> {
    try {
      const inviteLink = await this.boardService.shareBoard(shareData);
      return { inviteLink };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('validate-invite')
  async validateInvite(@Query('token') token: string): Promise<any> {
    try {
      return await this.boardService.validateInvite(token);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('accept-invite')
  async acceptInvite(
    @Body() data: { token: string },
  ): Promise<{ message: string }> {
    try {
      const message = await this.boardService.acceptInvite(data.token);
      return { message };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id/list-positions')
  async updateListPositions(
    @Param('id') boardId: number,
    @Body() data: { lists: any[] },
  ): Promise<{ message: string }> {
    try {
      const message = await this.boardService.updateListPosision(
        boardId,
        data.lists,
      );
      return { message };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
