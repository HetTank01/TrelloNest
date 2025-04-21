import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { BoardModule } from './board/board.module';
import { CardModule } from './card/card.module';
import { CommentModule } from './comment/comment.module';
import { ListModule } from './list/list.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelizeConfig } from './database/sequelize.config';
import { User } from './user/user.model';
import { BoardMaster } from './board/board.model';
import { ListMaster } from './list/list.model';
import { CardMaster } from './card/card.model';
import { CommentMaster } from './comment/comment.model';
import { MailService } from './mail/mail.service';

@Module({
  imports: [
    SequelizeModule.forRoot({
      ...sequelizeConfig,
      models: [User, BoardMaster, ListMaster, CardMaster, CommentMaster],
    }),

    UserModule,
    BoardModule,
    ListModule,
    CardModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
