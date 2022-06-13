import { v4 } from 'uuid';
import path from 'path';
import models from '../models/index.js';
import sequelize from '../db/db.js';
import ApiError from '../errors/ApiError.js';
import NotFoundError from '../errors/NotFoundError.js';

const { Artist } = models;

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const buildImgPath = (imgName) => path.resolve(__dirname, '..', '..', 'static', 'artists', imgName);

export default class ArtistController {
  static async create(req, res, next) {
    try {
      await sequelize.transaction(async (transaction) => {
        const { userId } = req.body;
        const imgName = req.files?.img ? `${v4()}.jpg` : 'default.jpg';

        const createParams = { ...req.body, user_id: userId, img: imgName };
        const { id } = await Artist.create(createParams, { returning: ['id'], transaction });
        await req.files?.img?.mv(buildImgPath(imgName));

        res.status(201).json({ id });
      });
    } catch (error) {
      next(new ApiError(error, 500));
    }
  }

  static async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const artist = await Artist.findOne({
        where: { id },
        attributes: ['name', 'bio', 'img'],
      });

      if (artist) {
        res.json(artist);
      } else {
        next(new NotFoundError());
      }
    } catch (error) {
      next(new ApiError(error, 500));
    }
  }

  static async getAll(_req, res, next) {
    try {
      const artists = await Artist.findAll({ attributes: ['id', 'name', 'img'] });

      res.json(artists);
    } catch (error) {
      next(new ApiError(error, 500));
    }
  }
}
