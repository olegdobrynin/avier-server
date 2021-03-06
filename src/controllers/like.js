import models from '../models/index.js';

const { Art, UserArtLike } = models;

export default class LikeController {
  static async like(req, res, next) {
    try {
      const { id } = res.locals.user;
      const { artId } = req.params;
      await UserArtLike.create({ user_id: Number(id), art_id: Number(artId) });

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }

  static async unLike(req, res, next) {
    try {
      const { id } = res.locals.user;
      const { artId } = req.params;
      await UserArtLike.destroy({ where: { user_id: Number(id), art_id: Number(artId) } });

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const { id } = res.locals.user;
      const { limit = 8, page = 1 } = req.query;
      const offset = (page - 1) * limit;

      const arts = await Art.findAndCountAll({
        attributes: ['id', 'img', 'name'],
        include: {
          model: UserArtLike, as: 'like', where: { user_id: Number(id) }, attributes: [],
        },
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
