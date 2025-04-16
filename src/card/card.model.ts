import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { CommentMaster } from 'src/comment/comment.model';
import { ListMaster } from 'src/list/list.model';

@Table({ tableName: 'card_master', timestamps: true })
export class CardMaster extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  position: number;

  @Column({ type: DataType.STRING, allowNull: true })
  description: string;

  @ForeignKey(() => ListMaster)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  ListMasterId: number;

  @BelongsTo(() => ListMaster)
  ListMaster: ListMaster;

  @HasMany(() => CommentMaster)
  comments: CommentMaster[];
}
