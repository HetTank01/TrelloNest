import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentMaster } from './comment.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { CardMaster } from 'src/card/card.model';

@Module({
  imports: [SequelizeModule.forFeature([CommentMaster, CardMaster])],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
