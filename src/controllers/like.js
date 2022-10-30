import models from '../models/index.js';

const { UserArtLike } = models;

export default class LikeController {
  static async like(req, reply) {
    const { id } = req.user;
    const { artId } = req.params;
    await UserArtLike.create({ user_id: Number(id), art_id: artId });

    reply.code(204);
  }

  static async unLike(req, reply) {
    const { id } = req.user;
    const { artId } = req.params;
    await UserArtLike.destroy({ where: { user_id: Number(id), art_id: artId } });

    reply.code(204);
  }
}
