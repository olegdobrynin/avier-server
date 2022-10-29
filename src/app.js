import express from 'express';
import cors from 'cors';
import path from 'path';
import router from './routes/index.js';
import { getDirname } from './utils/paths.js';
import notFoundHandler from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandling.js';

const __dirname = getDirname(import.meta.url);

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'https://avier.ru', 'https://avier-react.vercel.app'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
  credentials: false,
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));
app.use(express.static(path.resolve(__dirname, '..', 'static')));
app.use('/api', router);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
