import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { BoardMaster } from 'src/board/board.model';
import { CardMaster } from 'src/card/card.model';

@Table({ tableName: 'list_master' })
export class ListMaster extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  position: number;

  @ForeignKey(() => BoardMaster)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  BoardMasterId: number;

  @BelongsTo(() => BoardMaster)
  BoardMaster: BoardMaster;

  @HasMany(() => CardMaster)
  cards: CardMaster[];
}
