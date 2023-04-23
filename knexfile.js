// Update with your config settings.
import dotenv from 'dotenv';
dotenv.config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: 'pg',

    connection: {
      host: process.env.HOST,
      port: process.env.PORT,
      user: process.env.USER,
      database: process.env.DATABASE,
      password: process.env.PASSWORD
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/database/migrations'
    },
    seeds: {
      directory: './src/database/seeds'
    }
  }
};
