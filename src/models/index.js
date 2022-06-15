import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DataTypes } from 'sequelize';
import sequelize from '../db/db.js';

const __filename  = fileURLToPath(import.meta.url);
const { base: basename, dir: __dirname } = path.parse(__filename);

const promises = fs
  .readdirSync(__dirname)
  .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .map((file) => import(`./${file}`)));

const modules = await Promise.all(promises);
const models = modules
  .map(({ default: model }) => model(sequelize, DataTypes))
  .reduce((acc, model) => ({ ...acc, [model.name]: model }), {});

Object.keys(models)
  .forEach((modelName) => models[modelName].associate && models[modelName].associate(models));

export default models;
