import sequelize from 'sequelize';
import models from '../models/index.js';

const { Art, MarkArt, UserArtLike } = models;

export default class MarkController {
  static async mark(req, res, next) {
    try {
      const { id, artId } = req.params;
      await MarkArt.create({ mark_id: Number(id), art_id: Number(artId) });

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }

  static async unMark(req, res, next) {
    try {
      const { id, artId } = req.params;
      await MarkArt.destroy({ where: { mark_id: Number(id), art_id: Number(artId) } });

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const { id } = req.params;
      const { limit = 8, page = 1 } = req.query;
      const offset = (page - 1) * limit;

      const arts = await Art.findAndCountAll({
        attributes: ['id', 'img', 'name'],
        include: [
          {
            model: MarkArt,
            as: 'mark',
            where: { mark_id: Number(id) },
            attributes: [[sequelize.cast(sequelize.col('mark_id'), 'BOOL'), 'mark']],
          },
          {
            model: UserArtLike,
            as: 'like',
            required: false,
            where: { user_id: Number(id) },
            attributes: [[sequelize.cast(sequelize.col('like.user_id'), 'BOOL'), 'like']],
          },
        ],
        order: [['id', 'DESC']],
        limit,
        offset,
      });

      res.json(arts);
    } catch (error) {
      next(error);
    }
  }
}
