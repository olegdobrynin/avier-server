import { EmptyResultError } from 'sequelize';
import ApiError from '../errors/ApiError.js';

export default (err, _, reply) => {
  const { status, message } = err;
  if (err instanceof ApiError) {
    reply.code(status);
    return message && { message };
  }
  if (err instanceof EmptyResultError) {
    reply.code(404);
    return { message: 'Не найден' };
  }
  reply.code(500);
  return { message };
};
