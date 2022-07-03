import { v4 } from 'uuid';
import fs from 'fs/promises';
import { Op } from 'sequelize';
import models from '../models/index.js';
import sequelize from '../db/db.js';
import { buildImgPath } from '../helpers/paths.js';
import resizeAndWriteFile from '../helpers/resize.js';
import ApiError from '../errors/ApiError.js';
import NotFoundError from '../errors/NotFoundError.js';

const { Artist } = models;

export default class ArtistController {
  static async create(req, res, next) {
    try {
      await sequelize.transaction(async (transaction) => {
        const { userId } = req.body;
        const imgName = req.file ? `${v4()}.jpg` : 'default.jpg';

        const artist = await Artist.findOne({ where: { name: { [Op.iLike]: req.body.name } } });
        if (artist) {
          next(new ApiError('Художник с таким именем уже существует.', 400));
          return;
        }
        const { id, name, img } = await Artist.create(
          { ...req.body, user_id: userId, img: imgName },
          { returning: ['id', 'name', 'img'], transaction },
        );
        if (req.file) {
          await resizeAndWriteFile(req.file.buffer, buildImgPath('artists', imgName));
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
      const artist = await Artist.findByPk(id, { attributes: ['name', 'bio', 'img'] });

      if (artist) {
        res.json(artist);
      } else {
        next(new NotFoundError());
      }
    } catch (error) {
      next(error);
    }
  }

  static async getAll(_req, res, next) {
    try {
      const artists = await Artist.findAll({ attributes: ['id', 'name', 'img'] });

      res.json(artists);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      await sequelize.transaction(async (transaction) => {
        const { id } = req.params;
        const { name, bio } = req.body;
        const artist = await Artist.findByPk(id, { returning: ['img'], transaction });
        if (artist) {
          const { img: oldImgName } = artist;
          const newImgName = req.file
            ? `${v4()}.jpg`
            : oldImgName;

          const data = await artist.update({ name, bio, img: newImgName }, { transaction });
          if (req.file) {
            await fs.rm(buildImgPath('artists', oldImgName));
            await resizeAndWriteFile(req.file.buffer, buildImgPath('artists', newImgName));
          }

          res.json({ name: data.name, bio: data.bio, img: data.img });
        } else {
          next(new NotFoundError());
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await sequelize.transaction(async (transaction) => {
        const { id } = req.params;
        const artist = await Artist.findByPk(id, { attributes: ['id', 'name', 'img'], transaction });
        if (artist) {
          const { name, img: imgName } = artist;

          await artist.destroy({ transaction });
          if (imgName !== 'default.jpg') {
            await fs.rm(buildImgPath('artists', imgName));
          }
          res.json({ message: `Художник '${name}' удалён.` });
        } else {
          next(new NotFoundError());
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
