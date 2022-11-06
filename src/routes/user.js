import UserController from '../controllers/user.js';

const userBody = {
  type: 'object',
  required: ['login', 'password'],
  additionalProperties: false,
  properties: {
    login: { type: 'string' },
    password: { type: 'string' },
  },
};

const userWithToken = {
  type: 'object',
  properties: {
    user: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        login: { type: 'string' },
        role: { type: 'string' },
      },
    },
    token: { type: 'string' },
  },
};

export default async (fastify) => fastify
  .get('/auth', {
    schema: {
      response: { 200: userWithToken },
    },
    onRequest: [fastify.authorization(2)],
    handler: UserController.check,
  })
  .post('/registration', {
    schema: {
      body: userBody,
      response: { 201: userWithToken },
    },
    handler: UserController.registration,
  })
  .post('/login', {
    schema: {
      body: userBody,
      response: { 200: userWithToken },
    },
    handler: UserController.login,
  })
  .patch('/role', {
    schema: {
      body: {
        type: 'object',
        required: ['login', 'role'],
        additionalProperties: false,
        properties: {
          login: { type: 'string', minLength: 5 },
          role: { type: 'string', enum: ['admin', 'artist', 'manager', 'user'] },
        },
      },
      response: { 204: {} },
    },
    onRequest: [fastify.authorization(0)],
    handler: UserController.changeRole,
  })
  .delete('/:id(\\d+)', {
    schema: {
      params: { id: { type: 'integer', minimum: 1 } },
      response: { 204: {} },
    },
    onRequest: [fastify.authorization(2)],
    handler: UserController.delete,
  });
