import { Sequelize } from "sequelize-typescript";
import { logger } from "../utils/logger";

const DB_URL:string = <string>process.env.DATABASE_URL;

console.log({DB_URL},"DB URL")

const db = {};

// console.log()

const sequelize = new Sequelize(DB_URL,{
  logging(sql, _timing) {
    logger.debug(sql);
  },
});


export default sequelize;