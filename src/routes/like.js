import LikeController from '../controllers/like.js';

const artId = { type: 'integer', minimum: 1 };

export default async (fastify) => fastify
  .post('/:artId(\\d+)', {
    schema: {
      params: { artId },
      response: { 204: {} },
    },
    onRequest: [fastify.authorization(2)],
    handler: LikeController.like,
  })
  .delete('/:artId(\\d+)', {
    schema: {
      params: { artId },
      response: { 204: {} },
    },
    onRequest: [fastify.authorization(2)],
    handler: LikeController.unLike,
  });
