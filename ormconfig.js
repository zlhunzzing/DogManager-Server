const dotenv = require("dotenv");
dotenv.config();
module.exports = [
  {
    name: "development",
    type: process.env.DB_TYPE,
    host: process.env.DB_DEVELOPMENT_HOST,
    port: process.env.DB_DEVELOPMENT_PORT,
    username: process.env.DB_DEVELOPMENT_USERNAME,
    password: process.env.DB_DEVELOPMENT_PASSWORD,
    database: process.env.DB_DEVELOPMENT_DATABASE,
    entities: ["src/database/entity/*.ts"],
    logging: true,
    synchronize: true,
    seeds: ["src/database/seeds/**/*.seed.ts"],
    factories: ["src/database/factories/**/*.factory.ts"]
  },
  {
    name: "test",
    type: process.env.DB_TYPE,
    host: process.env.DB_DEVELOPMENT_HOST,
    port: process.env.DB_DEVELOPMENT_PORT,
    username: process.env.DB_DEVELOPMENT_USERNAME,
    password: process.env.DB_DEVELOPMENT_PASSWORD,
    database: process.env.DB_TEST_DATABASE,
    entities: ["src/database/entity/*.ts"],
    logging: false,
    synchronize: true,
    dropSchema: true
  },
  {
    name: "production",
    type: process.env.DB_TYPE,
    host: process.env.DB_PRODUCTION_HOST,
    port: process.env.DB_PRODUCTION_PORT,
    username: process.env.DB_PRODUCTION_USERNAME,
    password: process.env.DB_PRODUCTION_PASSWORD,
    database: process.env.DB_PRODUCTION_DATABASE,
    entities: ["dist/database/entity/*.js"],
    logging: false,
    synchronize: true
  }
];
