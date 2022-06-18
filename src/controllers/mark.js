import models from '../models/index.js';
import ApiError from '../errors/ApiError.js';

const { Art, MarkArt } = models;

export default class MarkController {
  static async mark(req, res, next) {
    try {
      const { id } = req.params;
      const { artId } = req.body;
      await MarkArt.create({ mark_id: id, art_id: artId });

      res.status(204).end();
    } catch (error) {
      next(new ApiError(error, 500));
    }
  }

  static async unMark(req, res, next) {
    try {
      const { id } = req.params;
      const { artId } = req.body;
      await MarkArt.destroy({ where: { mark_id: id, art_id: artId } });

      res.status(204).end();
    } catch (error) {
      next(new ApiError(error, 500));
    }
  }

  static async getAll(req, res, next) {
    try {
      const { id } = req.params;
      const arts = await Art.findAndCountAll({
        attributes: ['id', 'name'],
        include: { model: MarkArt, where: { mark_id: id }, attributes: [] },
      });

      res.json(arts);
    } catch (error) {
      next(new ApiError(error, 500));
    }
  }
}
