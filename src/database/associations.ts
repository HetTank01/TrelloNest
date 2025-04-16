import { BoardMaster } from 'src/board/board.model';
import { CardMaster } from 'src/card/card.model';
import { CommentMaster } from 'src/comment/comment.model';
import { ListMaster } from 'src/list/list.model';
import { User } from 'src/user/user.model';

export const defineAssociations = () => {
  // User.hasMany(BoardMaster);
  // BoardMaster.belongsTo(User);

  // Board <--> List
  BoardMaster.hasMany(ListMaster);
  ListMaster.belongsTo(BoardMaster);

  // List <--> Card
  ListMaster.hasMany(CardMaster);
  CardMaster.belongsTo(ListMaster);

  // Card <--> Comment
  CardMaster.hasMany(CommentMaster);
  CommentMaster.belongsTo(CardMaster);

  // User <--> Comment
  User.hasMany(CommentMaster);
  CommentMaster.belongsTo(User);

  // Nested Comments (Replies)
  CommentMaster.hasMany(CommentMaster, {
    as: 'replies',
    foreignKey: 'ParentId',
    onDelete: 'CASCADE',
  });

  CommentMaster.belongsTo(CommentMaster, {
    as: 'parent',
    foreignKey: 'ParentId',
  });
};
