import sequelize from 'sequelize';
import db from '../db/db.js';
import models from '../models/index.js';

const { MarkArt } = models;

export default class MarkController {
  static async mark(req, res, next) {
    try {
      const { id } = res.locals.user;
      const { artId } = req.params;
      await MarkArt.create({ mark_id: Number(id), art_id: Number(artId) });

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }

  static async unMark(req, res, next) {
    try {
      const { id } = res.locals.user;
      const { artId } = req.params;
      await MarkArt.destroy({ where: { mark_id: Number(id), art_id: Number(artId) } });

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const { id } = res.locals.user;
      const { artId, limit = 8 } = req.query;

      const arts = await db.query(
        'SELECT id, name, img, COALESCE(mark, false) AS mark, COALESCE("like", false) AS "like", '
      + 'COALESCE(likes::INTEGER, 0) AS likes FROM arts INNER JOIN (SELECT art_id, mark_id::BOOL '
      + `AS mark FROM mark_arts WHERE mark_id = ${id}) AS marks ON id = marks.art_id LEFT JOIN `
      + `(SELECT art_id, user_id::BOOL AS "like" FROM user_art_likes WHERE user_id = ${id}) `
      + 'AS likes ON id = likes.art_id LEFT JOIN (SELECT art_id, COUNT(*) AS likes '
      + 'FROM user_art_likes GROUP BY art_id) AS likesCount ON id = likesCount.art_id '
      + `${artId ? `WHERE id < ${artId}` : ''} ORDER BY id DESC LIMIT ${limit};`,
        { type: sequelize.QueryTypes.SELECT },
      );

      res.json(arts);
    } catch (error) {
      next(error);
    }
  }
}
