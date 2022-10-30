import MarkController from '../controllers/mark.js';
import { arts } from './art.js';

const artId = { type: 'integer', minimum: 1 };
const limit = { type: 'integer', minimum: 1, default: 8 };
const page = { type: 'integer', minimum: 1, default: 1 };

export default async (fastify) => fastify
  .get('/', {
    schema: {
      query: { limit, page },
      response: { 200: arts },
    },
    onRequest: [fastify.authorization(2)],
    handler: MarkController.getAll,
  })
  .post('/:artId(\\d+)', {
    schema: {
      params: { artId },
      response: { 204: {} },
    },
    onRequest: [fastify.authorization(2)],
    handler: MarkController.mark,
  })
  .delete('/:artId(\\d+)', {
    schema: {
      params: { artId },
      response: { 204: {} },
    },
    onRequest: [fastify.authorization(2)],
    handler: MarkController.unMark,
  });
