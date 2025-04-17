import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const sequelizeConfig: SequelizeModuleOptions = {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'trello_nest_db',
  models: [], // we'll populate this later
  autoLoadModels: true,
  synchronize: true,
  // sync: { alter: true },
};
