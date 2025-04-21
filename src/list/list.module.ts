import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ListMaster } from './list.model';
import { CardMaster } from 'src/card/card.model';

@Module({
  imports: [SequelizeModule.forFeature([ListMaster, CardMaster])],
  providers: [ListService],
  controllers: [ListController],
})
export class ListModule {}
