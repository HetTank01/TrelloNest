import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { CardMaster } from 'src/card/card.model';
import { User } from 'src/user/user.model';

@Table({ tableName: 'comment_master', timestamps: true })
export class CommentMaster extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  // Self-reference for nested comments (parent-child)
  @ForeignKey(() => CommentMaster)
  @Column({ type: DataType.INTEGER, allowNull: true })
  parentId: number;

  @BelongsTo(() => CommentMaster, 'parentId')
  parent: CommentMaster;

  @HasMany(() => CommentMaster, 'parentId')
  replies: CommentMaster[];

  // Relationship to card
  @ForeignKey(() => CardMaster)
  @Column({ type: DataType.INTEGER, allowNull: false })
  cardId: number;

  @BelongsTo(() => CardMaster)
  card: CardMaster;

  // Relationship to user
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
