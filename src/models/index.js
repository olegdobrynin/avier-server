import fs from 'fs';
import path from 'path';
import { DataTypes } from 'sequelize';
import sequelize from '../db/db.js'; // eslint-disable-line

const { pathname } = new URL(import.meta.url);
const { base: __filename, dir: __dirname } = path.parse(pathname);

const promises = fs
  .readdirSync(__dirname)
  .filter((file) => file.indexOf('.') !== 0 && file !== __filename && file.slice(-3) === '.js')
  .map((file) => import(path.join(__dirname, file)));

const modules = await Promise.all(promises);
const models = modules
  .map(({ default: model }) => model(sequelize, DataTypes))
  .reduce((acc, model) => ({ ...acc, [model.name]: model }), {});

Object.keys(models)
  .forEach((modelName) => models[modelName].associate && models[modelName].associate(models));

export default models;
