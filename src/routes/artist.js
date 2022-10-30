import multer from 'fastify-multer';
import { defaultLimits, fileFilter } from '../utils/multer.js';
import ArtistController from '../controllers/artist.js';

const upload = multer({ fileFilter, limits: { ...defaultLimits, fields: 3, files: 1 } });

const id = { type: 'integer', minimum: 1 };

const artist = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    img: { type: 'string' },
  },
};

const artists = { type: 'array', items: artist };

export default async (fastify) => fastify
  .register(multer.contentParser)
  .get('/', {
    schema: {
      response: { 200: artists },
    },
    onRequest: [fastify.authorization(2)],
    handler: ArtistController.getAll,
  })
  .get('/:id(\\d+)', {
    schema: {
      params: { id },
      response: {
        200: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            bio: { type: 'string' },
            img: { type: 'string' },
          },
        },
      },
    },
    handler: ArtistController.getOne,
  })
  .post('/', {
    schema: {
      response: { 201: artist },
    },
    onRequest: [fastify.authorization(1)],
    preHandler: upload.single('img'),
    handler: ArtistController.create,
  })
  .patch('/:id(\\d+)', {
    schema: {
      params: { id },
      response: {
        200: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            bio: { type: 'string' },
            img: { type: 'string' },
          },
        },
      },
    },
    onRequest: [fastify.authorization(1)],
    preHandler: upload.single('img'),
    handler: ArtistController.update,
  })
  .delete('/:id(\\d+)', {
    schema: {
      params: { id },
      response: { 204: {} },
    },
    onRequest: [fastify.authorization(1)],
    handler: ArtistController.delete,
  });
