import { v4 } from 'uuid';
import path from 'path';
import models from '../models/index.js';
import ApiError from '../errors/ApiError.js';

const { Art, ArtInfo, ArtArtist } = models;

const __dirname = path.dirname(new URL(import.meta.url).pathname);
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

    async getAll(req, res) {
        let {artistId, typeId, limit, page} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        let arts;
        if (!artistId && !typeId) {
            arts = await Art.findAndCountAll({limit, offset})
            }
        if (artistId && !typeId) {
            arts = await Art.findAndCountAll({where:{artistId}, limit, offset})
            }
        if (!artistId && typeId) {
            arts = await Art.findAndCountAll({where:{typeId}, limit, offset})            
            }
        if (artistId && typeId) {
            arts = await Art.findAndCountAll({where:{artistId, typeId}, limit, offset})            
        }
        return res.json(arts)
    }

    async getOne(req, res) {
        const {id} = req.params
        const art = await Art.findOne(
            {
                where: {id},
                include: [{model: ArtInfo, as: 'info'}],
                // include: [{model: ArtArtist, as: 'artist'}]
            }
        )
        return res.json(art)
    }
    
    async delete(req, res) {

    }

}

