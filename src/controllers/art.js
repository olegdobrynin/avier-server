import { v4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import models from '../models/index.js';
import sequelize from '../db/db.js';
import ApiError from '../errors/ApiError.js';
import NotFoundError from '../errors/NotFoundError.js';

const {
  Art, ArtExtraImg, ArtProp, Artist, ArtArtist,
} = models;

const artExtraImgModel = { model: ArtExtraImg, as: 'extraImgs', attributes: ['img'] };
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
        const {
          name, typeId, year, city, about, artists = '[]', properties = '[]',
        } = req.body;
        const filteredArtists = JSON.parse(artists).filter(({ artistId }) => artistId);
        if (filteredArtists.length < 1) {
          throw new Error('Выберите артиста.');
        }
        if (!typeId || typeId === 'undefined') {
          throw new Error('Выберите тип.');
        }
        if (!name || name.length < 5) {
          throw new Error('Введите название.');
        }
        if (!/^\d{0,4}$/.test(year) || (Number(year) > new Date().getFullYear())) {
          throw new Error('Введите правильный год.');
        }
        const mainImgName = req.files.length > 0 ? `${v4()}.jpg` : 'default.jpg';

        const { id: artId } = await Art.create(
          {
            name,
            year: (Number(year) || null),
            city: (city || null),
            about: (about || null),
            type_id: Number(typeId),
            img: mainImgName,
          },
          { returning: ['id'], transaction },
        );

        const artProperties = JSON.parse(properties)
          .filter(({ title, description }) => title && description)
          .map((property) => ({ ...property, art_id: Number(artId) }));
        const artArtists = filteredArtists
          .map(({ artistId }) => ({ art_id: Number(artId), artist_id: Number(artistId) }));

        await ArtProp.bulkCreate(artProperties, { returning: false, transaction });
        await ArtArtist.bulkCreate(artArtists, { returning: false, transaction });

        if (req.files.length > 0) {
          const extraImgNames = [...Array(req.files.length - 1)]
            .map(() => `${v4()}.jpg`);
          const extraImgs = extraImgNames
            .map((imgName) => ({ art_id: artId, img: imgName }));

          await ArtExtraImg.bulkCreate(extraImgs, { returning: false, transaction });

          const promises = [mainImgName, ...extraImgNames]
            .map((imgName) => buildImgPath(imgName))
            .map((imgPath, i) => fs.writeFile(imgPath, req.files[i].buffer));

          await Promise.all(promises);
        }

        res.status(201).json({ id: artId });
      });
    } catch (error) {
      next(new ApiError(error, 500));
    }
  }

  static async getAll(req, res, next) {
    try {
      const {
        artistId, typeId, limit = 8, page = 1,
      } = req.query;
      const offset = (page - 1) * limit;

      let findParameters = {
        distinct: true,
        attributes: ['id', 'name', 'img'],
        order: [['id', 'DESC']],
        limit,
        offset,
      };

      if (artistId) {
        findParameters = {
          ...findParameters,
          include: { ...artistModel, attributes: [], where: { id: Number(artistId) } },
        };
      }
      if (typeId) {
        findParameters = { ...findParameters, where: { type_id: Number(typeId) } };
      }
      const arts = await Art.findAndCountAll(findParameters);

      res.json(arts);
    } catch (error) {
      next(new ApiError(error, 500));
    }
  }

  static async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const art = await Art.findByPk(Number(id), {
        include: [artistModel, artPropModel, artExtraImgModel],
        attributes: { exclude: ['id', 'type_id', 'created_at', 'updated_at'] },
      });

      if (art) {
        const { dataValues: { img: mainImg, extraImgs } } = art;
        res.json({ ...art.toJSON(), imgs: [mainImg, ...extraImgs.map(({ img }) => img)] });
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
        const art = await Art
          .findByPk(Number(id), { attributes: ['id', 'name', 'img'], transaction });
        if (art) {
          const { name, img: mainImgName } = art;
          const extraImgNames = await ArtExtraImg
            .findAll({ where: { art_id: Number(id) }, attributes: ['img'], transaction });

          await art.destroy({ transaction });
          if (mainImgName !== 'default.jpg') {
            const promises = [{ img: mainImgName }, ...extraImgNames]
              .map(({ img: imgName }) => fs.rm(buildImgPath(imgName)));
            await Promise.all(promises);
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
