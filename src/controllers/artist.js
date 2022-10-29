import { v4 } from 'uuid';
import { Op } from 'sequelize';
import models from '../models/index.js';
import sequelize from '../db/db.js';
import { uploadImage, removeImage } from '../utils/imgs.js';
import ApiError from '../errors/ApiError.js';

const { Artist, User } = models;

export default class ArtistController {
  static async create(req, res, next) {
    try {
      await sequelize.transaction(async (transaction) => {
        const { id: userId } = res.locals.user;
        const imgName = req.file ? `${v4()}.jpg` : 'default.jpg';

        const artist = await Artist.findOne({ where: { name: { [Op.iLike]: req.body.name } } });
        if (artist) {
          throw new ApiError('Художник с таким именем уже существует.', 400);
        }
        const { id, name, img } = await Artist.create(
          { ...req.body, user_id: Number(userId), img: imgName },
          { returning: ['id', 'name', 'img'], transaction },
        );
        if (req.file) {
          await uploadImage(req.file.buffer, 'artists', imgName);
        }

        res.status(201).json({ id, name, img });
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const artist = await Artist.findByPk(Number(id), {
        attributes: ['name', 'bio', 'img'], rejectOnEmpty: true,
      });

      res.json(artist);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(_req, res, next) {
    try {
      const { id: userId } = res.locals.user;
      const artists = await Artist.findAll({
        attributes: ['id', 'name', 'img'],
        order: [['id', 'ASC']],
        where: { user_id: Number(userId) },
      });

      res.json(artists);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      await sequelize.transaction(async (transaction) => {
        const { id: userId, role } = res.locals.user;
        const { id } = req.params;
        const { name, bio, userLogin } = req.body;
        const where = role === 'admin'
          ? { id: Number(id) }
          : { id: Number(id), user_id: Number(userId) };

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
          name, bio, img: newImgName, user_id: user.id,
        }, { transaction });
        if (req.file) {
          if (oldImgName !== 'default.jpg') {
            await removeImage('artists', oldImgName);
          }
          await uploadImage(req.file.buffer, 'artists', newImgName);
        }

        res.json({ name: data.name, bio: data.bio, img: data.img });
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await sequelize.transaction(async (transaction) => {
        const { id: userId, role } = res.locals.user;
        const { id } = req.params;
        const where = role === 'admin'
          ? { id: Number(id) }
          : { id: Number(id), user_id: Number(userId) };

        const artist = await Artist.findOne({
          where, attributes: ['id', 'img'], rejectOnEmpty: true, transaction,
        });
        const { img: imgName } = artist;

        await artist.destroy({ transaction });
        if (imgName !== 'default.jpg') {
          await removeImage('artists', imgName);
        }
        res.sendStatus(204);
      });
    } catch (error) {
      next(error);
    }
  }
}
