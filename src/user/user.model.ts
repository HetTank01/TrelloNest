import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { BoardMaster } from 'src/board/board.model';
import { CommentMaster } from 'src/comment/comment.model';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  username: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.JSON, allowNull: true, defaultValue: [] })
  shared_boards: any;

  @HasMany(() => BoardMaster)
  boards: BoardMaster[];

  @HasMany(() => CommentMaster)
  comments: CommentMaster[];
}
