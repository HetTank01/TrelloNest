import { Injectable } from '@nestjs/common';
import { CommentMaster } from './comment.model';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/user.model';
import { CommentDto } from './dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(CommentMaster)
    private commentModel: typeof CommentMaster,
  ) {}

  async getAll(cardId: number): Promise<CommentMaster[]> {
    const comments = await this.commentModel.findAll({
      where: { cardId },
      include: [
        { model: User },
        {
          model: CommentMaster,
          as: 'replies',
          include: [{ model: User }],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return comments;
  }

  async create(commentData: CommentDto): Promise<CommentMaster> {
    const comment = await this.commentModel.create({ commentData });
    return comment;
  }

  async update(
    commentId: number,
    cardId: number,
    bodyData: any,
  ): Promise<void> {
    const isCardExist = await this.commentModel.findByPk(cardId);

    if (!isCardExist) {
      throw new Error('Card not found');
    }

    const comment = await this.commentModel.findByPk(commentId);

    if (!comment) {
      throw new Error('Comment not found');
    }

    await comment.update({ bodyData });
  }
}
