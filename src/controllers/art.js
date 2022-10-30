import { v4 } from 'uuid';
import sequelize from 'sequelize';
import models from '../models/index.js';
import db from '../db/db.js';
import { uploadImage, removeImage } from '../utils/imgs.js';
import ApiError from '../errors/ApiError.js';

const {
  Art, ArtExtraImg, ArtProp, Artist, ArtArtist, MarkArt, UserArtLike,
} = models;

export default class ArtController {
  static create(req, reply) {
    return db.transaction(async (transaction) => {
      const {
        name, typeId, year, city, about, artists = '[]', properties = '[]',
      } = req.body;
      const filteredArtists = JSON.parse(artists).filter(({ artistId }) => artistId);
      if (filteredArtists.length < 1) {
        throw new ApiError('Выберите артиста.', 400);
      }
      if (!typeId || typeId === 'undefined') {
        throw new ApiError('Выберите тип.', 400);
      }
      if (!name || name.length < 5) {
        throw new ApiError('Введите название.', 400);
      }
      if (!/^\d{0,4}$/.test(year) || (Number(year) > new Date().getFullYear())) {
        throw new ApiError('Введите правильный год.', 400);
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
        .map((property) => ({ ...property, art_id: artId }));
      const artArtists = filteredArtists
        .map(({ artistId }) => ({ art_id: artId, artist_id: Number(artistId) }));

      await ArtProp.bulkCreate(artProperties, { returning: false, transaction });
      await ArtArtist.bulkCreate(artArtists, { returning: false, transaction });

      if (req.files.length > 0) {
        const extraImgNames = [...Array(req.files.length - 1)]
          .map(() => `${v4()}.jpg`);
        const extraImgs = extraImgNames
          .map((imgName) => ({ art_id: artId, img: imgName }));

        await ArtExtraImg.bulkCreate(extraImgs, { returning: false, transaction });

        const promises = [mainImgName, ...extraImgNames]
          .map((imgName, i) => uploadImage(req.files[i].buffer, 'arts', imgName));

        await Promise.all(promises);
      }

      reply.code(201);
      return { id: artId };
    });
  }

  static async getAll(req) {
    const user = req.headers.authorization
      ? await req.jwtVerify()
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

    return arts;
  }

  static async getOne(req) {
    const user = req.headers.authorization
      ? await req.jwtVerify()
      : { id: null };
    const { artId } = req.params;
    const extraModels = user.id
      ? [{
        model: MarkArt,
        as: 'mark',
        attributes: [[sequelize.cast(sequelize.col('mark_id'), 'BOOL'), 'mark']],
        required: false,
        where: { mark_id: user.id },
      }, {
        model: UserArtLike,
        as: 'like',
        attributes: [[sequelize.cast(sequelize.col('like.art_id'), 'BOOL'), 'like']],
        required: false,
        where: { user_id: user.id },
      }]
      : [];

    const art = await Art.findByPk(artId, {
      attributes: { exclude: ['id', 'type_id', 'created_at', 'updated_at'] },
      include: [Artist.getModel('id', 'name'), ArtProp.model, ArtExtraImg.model, ...extraModels],
      rejectOnEmpty: true,
    });

    const likes = await UserArtLike.count({
      where: { art_id: artId }, col: ['user_id'], distinct: true,
    });

    const { dataValues: { img: mainImg, extraImgs } } = art;

    return { ...art.toJSON(), imgs: [mainImg, ...extraImgs.map(({ img }) => img)], likes };
  }

  static async delete(req, reply) {
    await db.transaction(async (transaction) => {
      const { id: userId, role } = req.user;
      const { artId } = req.params;
      const include = role === 'admin'
        ? null
        : { model: Artist, as: 'artists', where: { user_id: userId } };

      const art = await Art.findByPk(artId, {
        attributes: ['id', 'img'], include, rejectOnEmpty: true, transaction,
      });

      const { img: mainImgName } = art;
      const extraImgNames = await ArtExtraImg
        .findAll({ where: { art_id: artId }, attributes: ['img'], transaction });

      await art.destroy({ transaction });
      if (mainImgName !== 'default.jpg') {
        const promises = [{ img: mainImgName }, ...extraImgNames].map(({ img: imgName }) => (
          removeImage('arts', imgName)
            .catch((err) => {
              if (err.code === 'ENOENT') return null;
              throw err;
            })
        ));
        await Promise.all(promises);
      }
      reply.code(204);
    });
  }
}
