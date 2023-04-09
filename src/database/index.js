import { Model } from 'objection';
import Knex from 'knex';

const knex = Knex({
  client: 'pg',
  connection: {
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD
  }
});

Model.knex(knex);
