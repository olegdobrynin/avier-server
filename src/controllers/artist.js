import { v4 } from 'uuid';
import { Op } from 'sequelize';
import models from '../models/index.js';
import sequelize from '../db/db.js';
import { uploadImage, removeImage } from '../utils/imgs.js';
import ApiError from '../errors/ApiError.js';

const { Artist, User } = models;

export default class ArtistController {
  static create(req, reply) {
    return sequelize.transaction(async (transaction) => {
      const { id: userId } = req.user;
      const imgName = req.file ? `${v4()}.jpg` : 'default.jpg';

      const artist = await Artist.findOne({ where: { name: { [Op.iLike]: req.body.name } } });
      if (artist) {
        throw new ApiError('Художник с таким именем уже существует.', 400);
      }
      const { id, name, img } = await Artist.create(
        { ...req.body, userId, img: imgName },
        { returning: ['id', 'name', 'img'], transaction },
      );
      if (req.file) {
        await uploadImage(req.file.buffer, 'artists', imgName);
      }

      reply.code(201);
      return { id, name, img };
    });
  }

  static async getOne(req) {
    const { id } = req.params;
    const artist = await Artist.findByPk(id, {
      attributes: ['name', 'bio', 'img'], rejectOnEmpty: true,
    });

    return artist;
  }

  static async getAll(req) {
    const { id: userId } = req.user;
    const artists = await Artist.findAll({
      where: { userId },
      attributes: ['id', 'name', 'img'],
      order: [['id', 'ASC']],
    });

    return artists;
  }

  static update(req) {
    return sequelize.transaction(async (transaction) => {
      const { id: userId, role } = req.user;
      const { id } = req.params;
      const { name, bio, userLogin } = req.body;
      const where = role === 'admin' ? { id } : { id, userId };

      const artist = await Artist.findOne({
        where, returning: ['img'], rejectOnEmpty: true, transaction,
      });
      const user = await User.findOne({
        where: { login: userLogin }, attributes: ['id'], transaction,
      });
      if (!user) {
        throw new ApiError('Пользователь с таким логином не найден!', 400);
      }
      const { img: oldImgName } = artist;
      const newImgName = req.file ? `${v4()}.jpg` : oldImgName;

      const data = await artist.update({
        name, bio, img: newImgName, userId: user.id,
      }, { transaction });
      if (req.file) {
        if (oldImgName !== 'default.jpg') {
          await removeImage('artists', oldImgName);
        }
        await uploadImage(req.file.buffer, 'artists', newImgName);
      }

      return { name: data.name, bio: data.bio, img: data.img };
    });
  }

  static async delete(req, reply) {
    await sequelize.transaction(async (transaction) => {
      const { id: userId, role } = req.user;
      const { id } = req.params;
      const where = role === 'admin' ? { id } : { id, userId };

      const artist = await Artist.findOne({
        where, attributes: ['id', 'img'], rejectOnEmpty: true, transaction,
      });
      const { img: imgName } = artist;

      await artist.destroy({ transaction });
      if (imgName !== 'default.jpg') {
        await removeImage('artists', imgName);
      }
      reply.code(204);
    });
  }
}
