import { readFileSync } from 'fs';
import { dirname } from 'path';
import Sequelize from 'sequelize';

const __dirname = dirname(new URL(import.meta.url).pathname);
const configFile = JSON.parse(readFileSync(`${__dirname}/config.json`, 'utf-8'));
const env = process.env.NODE_ENV ?? 'development';
const config = configFile[env];

const sequelize = config.NODE_ENV
  ? new Sequelize(process.env[config.database], process.env[config.username], process.env[config.password], {    host: process.env[config.host], dialect: config.dialect  })
  : new Sequelize(config.database, config.username, config.password, config);

export default sequelize;
