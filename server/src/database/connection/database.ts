import { Sequelize } from "sequelize";
import cls from 'cls-hooked';
import dotenv from "dotenv";

dotenv.config();

const namespace = cls.createNamespace('sequelize-test-namespace');
(Sequelize as any).useCLS(namespace);

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST!,
    dialect: "postgres",
    port: Number(process.env.DB_PORT!),
    logging: false,
  }
);

export default sequelize;