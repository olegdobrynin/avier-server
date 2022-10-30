import models from '../models/index.js';

const { UserArtLike } = models;

export default class LikeController {
  static async like(req, reply) {
    const { id: userId } = req.user;
    const { artId } = req.params;
    await UserArtLike.create({ userId, artId });

    reply.code(204);
  }

  static async unLike(req, reply) {
    const { id: userId } = req.user;
    const { artId } = req.params;
    await UserArtLike.destroy({ where: { userId, artId } });

    reply.code(204);
  }
}
