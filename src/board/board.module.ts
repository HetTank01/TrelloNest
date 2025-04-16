import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { BoardMaster } from './board.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([BoardMaster])],
  providers: [BoardService],
  controllers: [BoardController],
})
export class BoardModule {}
