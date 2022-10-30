import sequelize from 'sequelize';
import db from '../db/db.js';
import models from '../models/index.js';

const { MarkArt } = models;

export default class MarkController {
  static async mark(req, reply) {
    const { id } = req.user;
    const { artId } = req.params;
    await MarkArt.create({ mark_id: Number(id), art_id: artId });

    reply.code(204);
  }

  static async unMark(req, reply) {
    const { id } = req.user;
    const { artId } = req.params;
    await MarkArt.destroy({ where: { mark_id: Number(id), art_id: artId } });

    reply.code(204);
  }

  static async getAll(req) {
    const { id } = req.user;
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

    return arts;
  }
}
