import TypeController from '../controllers/type.js';

const type = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
  },
};

const types = { type: 'array', items: type };

export default async (fastify) => fastify
  .get('/', {
    schema: {
      response: { 200: types },
    },
    handler: TypeController.getAll,
  })
  .post('/', {
    schema: {
      body: {
        type: 'object',
        required: ['name'],
        additionalProperties: false,
        properties: { name: { type: 'string', nullable: false } },
      },
      response: { 201: type },
    },
    onRequest: [fastify.authorization(0)],
    handler: TypeController.create,
  })
  .delete('/:id(\\d+)', {
    schema: {
      params: { id: { type: 'integer', minimum: 1 } },
      response: { 204: {} },
    },
    onRequest: [fastify.authorization(0)],
    handler: TypeController.delete,
  });
