import express from 'express';
import userRoutes from './routes/userRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import preferenceRoutes from './routes/preferenceRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import { errorHandler } from './utils/errors.js';
import cors from 'cors';
import 'express-async-errors';
import './database/index.js';

const API_ENTRYPOINT = '/api/v1';
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(API_ENTRYPOINT, addressRoutes);
app.use(API_ENTRYPOINT, userRoutes);
app.use(API_ENTRYPOINT, preferenceRoutes);
app.use(API_ENTRYPOINT, eventRoutes);
app.use(API_ENTRYPOINT, requestRoutes);

app.use(errorHandler);

app.listen(4444, () => {
  console.log('App listening on port 4444');
});
