import folderController from '../controllers/folder.js';

export default async (fastify) => fastify
  .get('/', {
    schema: {},
    handler: folderController.getAll,
  })
  .post('/', {
    schema: {},
    handler: folderController.create,
  })
  .get('/:id(\\d+)', {
    schema: {},
    handler: folderController.getOne,
  })
  .patch('/:id(\\d+)', {
    schema: {},
    handler: folderController.update,
  })
  .delete('/:id(\\d+)', {
    schema: {},
    handler: folderController.delete,
  });
