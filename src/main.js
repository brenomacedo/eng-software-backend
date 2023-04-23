import express from 'express';
import './database/index.js';
import userRoutes from './routes/userRoutes.js';

const API_ENTRYPOINT = '/api/v1';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(API_ENTRYPOINT, userRoutes);

app.listen(3333, () => {
  console.log('App listening on port 3333');
});
