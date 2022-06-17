import Sequelize from 'sequelize';
import configFile from './config.js';

const env = process.env.NODE_ENV ?? 'development';
const config = configFile[env];

const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

export default sequelize;
