import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { BoardMaster } from './board.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { ListMaster } from 'src/list/list.model';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [SequelizeModule.forFeature([BoardMaster, ListMaster]), MailModule],
  providers: [BoardService],
  controllers: [BoardController],
})
export class BoardModule {}
