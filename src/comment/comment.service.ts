import { Injectable } from '@nestjs/common';
import { CommentMaster } from './comment.model';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/user.model';
import { CommentDto } from './dto/comment.dto';
import { CardMaster } from 'src/card/card.model';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(CommentMaster)
    private commentModel: typeof CommentMaster,

    @InjectModel(CardMaster)
    private cardModel: typeof CardMaster,
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
    const comment = await this.commentModel.create({ ...commentData });
    return comment;
  }

  async update(
    commentId: number,
    cardId: number,
    bodyData: any,
  ): Promise<void> {
    const isCardExist = await this.cardModel.findByPk(cardId);

    if (!isCardExist) {
      throw new Error('Card not found');
    }

    const comment = await this.commentModel.findByPk(commentId);

    if (!comment) {
      throw new Error('Comment not found');
    }

    await comment.update({ ...bodyData });
  }

  async delete(commentId: number, CardMasterId: number): Promise<void> {
    const isCardExist = await this.cardModel.findByPk(CardMasterId);

    if (!isCardExist) {
      throw new Error('Card not found');
    }

    const isCommentExist = await this.commentModel.findByPk(commentId);

    if (!isCommentExist) {
      throw new Error('Comment not found');
    }

    const comments = await this.commentModel.findAll({
      where: { ParentId: isCommentExist.id },
    });

    await Promise.all(comments.map((comment) => comment.destroy()));
    await isCommentExist.destroy();
  }

  async createReply(
    description: string,
    UserMasterId: number,
    ParentId: number,
  ): Promise<CommentMaster> {
    const isParentCommentExist = await this.commentModel.findByPk(ParentId);

    if (!isParentCommentExist) {
      throw new Error('Parent comment not found');
    }

    const reply = await this.commentModel.create({
      description,
      UserMasterId,
      ParentId,
      CardMasterId: isParentCommentExist.CardMasterId,
    });

    return reply;
  }
}
