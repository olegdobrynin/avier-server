import { v4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import models from '../models/index.js';
import sequelize from '../db/db.js';
import ApiError from '../errors/ApiError.js';
import NotFoundError from '../errors/NotFoundError.js';

const {
  Art, ArtProp, Artist, ArtArtist,
} = models;

const artPropModel = { model: ArtProp, as: 'properties', attributes: ['title', 'description'] };
const artistModel = {
  model: Artist, as: 'artists', attributes: ['id', 'name'], through: { attributes: [] },
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const buildImgPath = (imgName) => path.resolve(__dirname, '..', '..', 'static', 'arts', imgName);

export default class ArtController {
  static async create(req, res, next) {
    try {
      await sequelize.transaction(async (transaction) => {
        const { typeId, artistId = '[]', property = '[]' } = req.body;
        const imgName = req.files?.img ? `${v4()}.jpg` : 'default.jpg';

        const { id: artId } = await Art.create(
          { ...req.body, type_id: typeId, img: imgName },
          { returning: ['id'], transaction },
        );

        const properties = JSON.parse(property)
          .map((prop) => ({ ...prop, art_id: Number(artId) }));
        const artArtists = JSON.parse(artistId)
          .map((id) => ({ art_id: Number(artId), artist_id: Number(id) }));

        await ArtProp.bulkCreate(properties, { returning: false, transaction });
        await ArtArtist.bulkCreate(artArtists, { returning: false, transaction });
        await req.files?.img?.mv(buildImgPath(imgName));

        res.status(201).json({ id: artId });
      });
    } catch (error) {
      next(new ApiError(error, 500));
    }
  }

  static async getAll(req, res, next) {
    try {
      const {
        artistId, typeId, limit = 9, page = 1,
      } = req.query;
      const offset = (page - 1) * limit;

      let countParameters = {};
      let findParameters = {
        attributes: ['id', 'name', 'img'],
        include: [artistModel],
        order: [['id', 'DESC']],
        limit,
        offset,
      };

      if (artistId) {
        countParameters = {
          ...countParameters,
          include: { model: Artist, as: 'artists', where: { id: Number(artistId) } },
        };
        findParameters = {
          ...findParameters,
          include: { ...artistModel, where: { id: Number(artistId) } },
        };
      }
      if (typeId) {
        countParameters = { ...countParameters, where: { type_id: Number(typeId) } };
        findParameters = { ...findParameters, where: { type_id: Number(typeId) } };
      }
      const arts = await Art.findAll(findParameters);
      const count = await Art.count(countParameters);

      res.json({ count, rows: arts });
    } catch (error) {
      next(new ApiError(error, 500));
    }
  }

  static async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const art = await Art.findOne({
        where: { id },
        include: [artistModel, artPropModel],
        attributes: ['name', 'year', 'about', 'city', 'img', 'like'],
      });

      if (art) {
        res.json(art);
      } else {
        next(new NotFoundError());
      }
    } catch (error) {
      next(new ApiError(error, 500));
    }
  }

  static async delete(req, res, next) {
    try {
      await sequelize.transaction(async (transaction) => {
        const { id } = req.params;
        const art = await Art.findOne({ where: { id }, transaction });
        if (art) {
          const { name, img: imgName } = art;

          await art.destroy({ transaction });
          if (imgName !== 'default.jpg') {
            await fs.rm(buildImgPath(imgName));
          }
          res.json({ message: `Произведение '${name}' удалено.` });
        } else {
          next(new NotFoundError());
        }
      });
    } catch (error) {
      next(new ApiError(error, 500));
    }
  }
}
