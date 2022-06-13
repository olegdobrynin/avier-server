import models from '../models/index.js';
import ApiError from '../errors/ApiError.js';
import NotFoundError from '../errors/NotFoundError.js';

const { Art, Mark, MarkArt } = models;

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
      const count = await MarkArt.count({ where: { mark_id: id } });
      if (count) {
        const [{ arts }] = await Mark.findAll({
          attributes: [],
          include: {
            model: Art,
            as: 'arts',
            attributes: ['id', 'name'],
            through: { where: { mark_id: id }, attributes: [] },
          },
        });

        res.json({ count, rows: arts });
      } else {
        next(new NotFoundError());
      }
    } catch (error) {
      next(new ApiError(error, 500));
    }
  }
}
