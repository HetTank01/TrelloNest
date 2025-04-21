import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CardMaster } from './card.model';
import { ListMaster } from 'src/list/list.model';

@Module({
  imports: [SequelizeModule.forFeature([CardMaster, ListMaster])],
  providers: [CardService],
  controllers: [CardController],
})
export class CardModule {}
