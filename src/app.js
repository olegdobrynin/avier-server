import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fileUpload from 'express-fileupload';
import router from './routes/index.js';
import notFoundHandler from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandling.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '..', 'static')));
app.use(fileUpload());
app.use('/api', router);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
