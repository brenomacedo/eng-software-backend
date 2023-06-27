import { Model } from 'objection';
import Knex from 'knex';
import config from '../../knexfile.js';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

console.log('node_env: ', process.env.NODE_ENV);
console.log('config: ', config[process.env.NODE_ENV || 'development']);

const knex = Knex(config[process.env.NODE_ENV || 'development']);

Model.knex(knex);
