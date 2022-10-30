import fastify from 'fastify';
import cors from '@fastify/cors';
import staticHandler from '@fastify/static';
import path from 'path';
import router from './routes/index.js';
import { getDirname } from './utils/paths.js';
import errorHandler from './plugins/errorHandler.js';
import authorization from './plugins/authorization.js';

const __dirname = getDirname(import.meta.url);

const app = fastify();

app.setErrorHandler(errorHandler);
await app.register(cors, {
  origin: ['http://localhost:3000', 'https://avier.ru', 'https://avier-react.vercel.app'],
  methods: ['PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
  credentials: false,
  optionsSuccessStatus: 204,
});
await app.register(staticHandler, { root: path.resolve(__dirname, '..', 'static') });
await app.register(authorization);
await app.register(router, { prefix: '/api' });

export default app;
