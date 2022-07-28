import fs from 'fs';
import { DataTypes } from 'sequelize';
import sequelize from '../db/db.js';
import { getDirname } from '../utils/paths.js';

const __dirname = getDirname(import.meta.url);

const promises = fs
  .readdirSync(__dirname)
  .filter((file) => !file.startsWith('.') && file !== 'index.js' && file.endsWith('.js'))
  .map((file) => import(`./${file}`));

const modules = await Promise.all(promises);
const models = modules
  .map(({ default: model }) => model(sequelize, DataTypes))
  .reduce((acc, model) => ({ ...acc, [model.name]: model }), {});

Object.keys(models)
  .forEach((modelName) => models[modelName].associate && models[modelName].associate(models));

export default models;
