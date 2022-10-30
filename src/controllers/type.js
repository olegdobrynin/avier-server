import models from '../models/index.js';

const { Type } = models;

export default class TypeController {
  static async create(req, reply) {
    const { name } = req.body;
    const { id } = await Type.create({ name });

    reply.code(201);
    return { id, name };
  }

  static async getAll() {
    const types = await Type.findAll({ attributes: ['id', 'name'] });

    return types;
  }

  static async delete(req, reply) {
    const { id } = req.params;
    await Type.destroy({ where: { id } });

    reply.code(204);
  }
}
