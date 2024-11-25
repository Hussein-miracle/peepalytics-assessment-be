import { Sequelize } from "sequelize-typescript";

const DB_URL = <string>process.env.DATABASE_URL;


const sequelize = new Sequelize(DB_URL,{
  dialect: 'postgres',
  logging: false,
});


export default sequelize;