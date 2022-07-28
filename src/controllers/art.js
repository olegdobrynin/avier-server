import { v4 } from 'uuid';
import fs from 'fs/promises';
import jwt from 'jsonwebtoken';
import sequelize from 'sequelize';
import models from '../models/index.js';
import db from '../db/db.js';
import { buildImgPath } from '../helpers/paths.js';
import resizeAndWriteFile from '../helpers/resize.js';

const {
  Art, ArtExtraImg, ArtProp, Artist, ArtArtist, MarkArt, UserArtLike,
} = models;

export default class ArtController {
  static async create(req, res, next) {
    try {
      await db.transaction(async (transaction) => {
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
            year: Number(year) || null,
            city: city || null,
            about: about || null,
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
            .map((imgName) => buildImgPath('arts', imgName))
            .map((imgPath, i) => resizeAndWriteFile(req.files[i].buffer, imgPath));

          await Promise.all(promises);
        }

        res.status(201).json({ id: artId });
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const user = req.headers.authorization
        ? jwt.verify(req.headers.authorization.split(' ').at(1), process.env.SECRET_KEY)
        : { id: null };
      const {
        artistId, typeId, limit = 8, page = 1,
      } = req.query;
      const offset = (page - 1) * limit;

      const arts = await db.query(
        'SELECT id, name, img, COALESCE(likes::INTEGER, 0) AS likes'
      + `${user.id ? ', COALESCE(mark, false) AS mark, COALESCE("like", false) AS "like" ' : ' '}`
      + 'FROM arts LEFT JOIN (SELECT art_id, COUNT(*) AS likes FROM user_art_likes GROUP BY art_id) '
      + 'AS likesCount ON id = likesCount.art_id '
      + `${user.id
        ? `LEFT JOIN (SELECT art_id, mark_id::BOOL AS mark FROM mark_arts WHERE mark_id = ${user.id}) `
      + 'AS marks ON id = marks.art_id LEFT JOIN (SELECT art_id, user_id::BOOL AS "like" '
      + `FROM user_art_likes WHERE user_id = ${user.id}) AS likes ON id = likes.art_id `
        : ''}`
      + `${artistId
        ? `INNER JOIN (SELECT art_id, artist_id FROM art_artists WHERE artist_id = ${artistId}) `
      + 'AS artists ON id = artists.art_id '
        : ''}`
      + `${typeId ? `WHERE type_id = ${typeId} ` : ''}ORDER BY id DESC LIMIT ${limit} OFFSET ${offset};`,
        { type: sequelize.QueryTypes.SELECT },
      );

      res.json(arts);
    } catch (error) {
      next(error);
    }
  }

  static async getOne(req, res, next) {
    try {
      const user = req.headers.authorization
        ? jwt.verify(req.headers.authorization.split(' ').at(1), process.env.SECRET_KEY)
        : { id: null };
      const { id } = req.params;
      const extraModels = user.id
        ? [{
          model: MarkArt,
          as: 'mark',
          attributes: [[sequelize.cast(sequelize.col('mark_id'), 'BOOL'), 'mark']],
          required: false,
          where: { mark_id: Number(user.id) },
        }, {
          model: UserArtLike,
          as: 'like',
          attributes: [[sequelize.cast(sequelize.col('like.art_id'), 'BOOL'), 'like']],
          required: false,
          where: { user_id: Number(user.id) },
        }]
        : [];

      const art = await Art.findByPk(Number(id), {
        attributes: { exclude: ['id', 'type_id', 'created_at', 'updated_at'] },
        include: [Artist.getModel('id', 'name'), ArtProp.model, ArtExtraImg.model, ...extraModels],
        rejectOnEmpty: true,
      });

      const likes = await UserArtLike.count({
        where: { art_id: Number(id) }, col: ['user_id'], distinct: true,
      });

      const { dataValues: { img: mainImg, extraImgs } } = art;

      res.json({ ...art.toJSON(), imgs: [mainImg, ...extraImgs.map(({ img }) => img)], likes });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      await db.transaction(async (transaction) => {
        const { id: userId, role } = res.locals.user;
        const { id } = req.params;
        const include = role === 'admin'
          ? null
          : { model: Artist, as: 'artists', where: { user_id: userId } };

        const art = await Art.findByPk(Number(id), {
          attributes: ['id', 'img'], include, rejectOnEmpty: true, transaction,
        });

        const { img: mainImgName } = art;
        const extraImgNames = await ArtExtraImg
          .findAll({ where: { art_id: Number(id) }, attributes: ['img'], transaction });

        await art.destroy({ transaction });
        if (mainImgName !== 'default.jpg') {
          const promises = [{ img: mainImgName }, ...extraImgNames].map(({ img: imgName }) => (
            fs.rm(buildImgPath('arts', imgName))
              .catch((err) => (err.code === 'ENOENT' ? null : next(err)))
          ));
          await Promise.all(promises);
        }
        res.sendStatus(204);
      });
    } catch (error) {
      next(error);
    }
  }
}
