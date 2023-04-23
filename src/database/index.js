import { Model } from 'objection';
import Knex from 'knex';
import config from '../../knexfile.js';
import dotenv from 'dotenv';
dotenv.config();

const knex = Knex(config[process.env.NODE_ENV || 'development']);

Model.knex(knex);
