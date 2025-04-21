import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';
import { CommentReplyDto } from './dto/comment-reply.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async getAllComments(@Query('cardId') cardId: number) {
    const comments = await this.commentService.getAll(cardId);
    return comments;
  }

  @Post()
  async createComment(@Body() commentData: CommentDto) {
    const comment = await this.commentService.create(commentData);

    return {
      message: 'Comment created successfully',
      data: comment,
    };
  }

  @Put(':commentId')
  async updateComment(
    @Param('commentId') commentId: number,
    @Body('CardMasterId') CardMasterId: number,
    @Body() bodyData: CommentDto,
  ) {
    const comment = await this.commentService.update(
      commentId,
      CardMasterId,
      bodyData,
    );

    return {
      message: 'Comment updated successfully',
      data: comment,
    };
  }

  @Delete(':commentId')
  async deleteComment(
    @Param('commentId') commentId: number,
    @Body('CardMasterId') CardMasterId: number,
  ) {
    await this.commentService.delete(commentId, CardMasterId);

    return {
      message: 'Comment deleted successfully',
    };
  }

  @Post('/reply')
  async replyComment(@Body() replyDto: CommentReplyDto) {
    const { description, UserMasterId, ParentId } = replyDto;
    const comment = await this.commentService.createReply(
      description,
      UserMasterId,
      ParentId,
    );

    return {
      message: 'Comment created successfully',
      data: comment,
    };
  }
}
