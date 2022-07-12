import models from '../models/index.js';

const { Type } = models;

export default class TypeController {
  static async create(req, res, next) {
    try {
      const { name } = req.body;
      const { id } = await Type.create({ name });

      res.status(201).json({ id, name });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(_req, res, next) {
    try {
      const types = await Type.findAll({ attributes: ['id', 'name'] });

      res.json(types);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      await Type.destroy({ where: { id } });

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
}
