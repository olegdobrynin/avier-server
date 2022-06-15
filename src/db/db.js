import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import Sequelize from 'sequelize';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pathToConfig = path.resolve(__dirname, 'config.json');
const configFile = JSON.parse(readFileSync(pathToConfig, 'utf-8'));
const env = process.env.NODE_ENV ?? 'development';
const config = configFile[env];

const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

export default sequelize;
