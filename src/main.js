import express from 'express';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './utils/errors.js';
import 'express-async-errors';
import './database/index.js';

const API_ENTRYPOINT = '/api/v1';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(API_ENTRYPOINT, userRoutes);

app.use(errorHandler);

app.listen(3333, () => {
  console.log('App listening on port 3333');
});
