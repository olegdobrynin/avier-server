import multer from 'fastify-multer';
import { defaultLimits, fileFilter } from '../utils/multer.js';
import ArtController from '../controllers/art.js';

const upload = multer({ fileFilter, limits: { ...defaultLimits, fields: 7, files: 5 } });

const artId = { type: 'integer', minimum: 1 };
const artistId = artId;
const typeId = artId;
const limit = { type: 'integer', minimum: 1, default: 8 };
const page = { type: 'integer', minimum: 1, default: 1 };

const art = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    year: { type: 'string' },
    city: { type: 'string' },
    about: { type: 'string' },
    img: { type: 'string' },
    imgs: { type: 'array', items: { type: 'string' } },
    likes: { type: 'integer' },
    like: {
      type: 'array',
      items: { type: 'object', properties: { like: { type: 'boolean' } } },
    },
    mark: {
      type: 'array',
      items: { type: 'object', properties: { mark: { type: 'boolean' } } },
    },
    artists: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
        },
      },
    },
    properties: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
        },
      },
    },
  },
};

export const arts = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      img: { type: 'string' },
      like: { type: 'boolean' },
      mark: { type: 'boolean' },
      likes: { type: 'integer' },
    },
  },
};

export default async (fastify) => fastify
  .register(multer.contentParser)
  .get('/', {
    schema: {
      query: {
        artistId, typeId, limit, page,
      },
      response: { 200: arts },
    },
    handler: ArtController.getAll,
  })
  .get('/:artId(\\d+)', {
    schema: {
      params: { artId },
      response: { 200: art },
    },
    handler: ArtController.getOne,
  })
  .post('/', {
    schema: {
      response: {
        201: { type: 'object', properties: { id: { type: 'integer' } } },
      },
    },
    onRequest: [fastify.authorization(1)],
    preHandler: upload.array('img', 5),
    handler: ArtController.create,
  })
  .delete('/:artId(\\d+)', {
    schema: {
      params: { artId },
      response: { 204: {} },
    },
    onRequest: [fastify.authorization(1)],
    handler: ArtController.delete,
  });
