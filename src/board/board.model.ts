import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { ListMaster } from 'src/list/list.model';
import { User } from 'src/user/user.model';

@Table({ tableName: 'board_master' })
export class BoardMaster extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  UserMasterId: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => ListMaster)
  lists: ListMaster[];
}
