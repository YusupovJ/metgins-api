import { config } from "dotenv";

config();

export const envConfig = {
  port: process.env.PORT,
  apiUrl: process.env.API_URL,
  database: {
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
  },
  jwt: {
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
    accessExpire: process.env.ACCESS_TOKEN_EXPIRE,
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshExpire: process.env.REFRESH_TOKEN_EXPIRE,
  },
};
