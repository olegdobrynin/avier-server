import models from '../models/index.js';
import ApiError from '../errors/ApiError.js';

const { Type } = models;

export default class TypeController {
  static async create(req, res, next) {
    try {
      const { name } = req.body;
      const type = await Type.create({ name });

      res.json(type);
    } catch (error) {
      next(new ApiError(error, 500));
    }
  }

  static async getAll(_req, res, next) {
    try {
      const types = await Type.findAll({ attributes: ['id', 'name'] });

      res.json(types);
    } catch (error) {
      next(new ApiError(error, 500));
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      await Type.destroy({ where: { id } });

      res.json({ message: 'Тип удалён.' });
    } catch (error) {
      next(new ApiError(error, 500));
    }
  }
}
