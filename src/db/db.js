import { readFileSync } from 'fs';
import { dirname } from 'path';
import Sequelize from 'sequelize';

const __dirname = dirname(new URL(import.meta.url).pathname);
const configFile = JSON.parse(readFileSync(`${__dirname}/config.json`, 'utf-8'));
const env = process.env.NODE_ENV ?? 'development';
const config = configFile[env];

const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

export default sequelize;
