import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Product } from "./entity/Product";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

if (!process.env.NODE_ENV) {
  console.warn("NODE_ENV is not set. Defaulting to development.");
  process.env.NODE_ENV = "development";
}

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "product_db",
  entities: [User, Product],
  migrations: ["src/migrations/*.ts"],
  synchronize: false,
  logging: !isProduction,
});
