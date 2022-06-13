import uuid from 'uuid';
import path from 'path';
import models from '../models/index.js';
import ApiError from '../errors/ApiError.js';

const { Art, ArtInfo, ArtArtist } = models;

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default class ArtController {

    async create(req, res, next) {
        try {
            let {name, about, city, year, typeId, artistId, info} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const art = await Art.create({name, about, city, year, typeId, img: fileName})

            if(info){
                info = JSON.parse(info)
                info.forEach(i =>
                    ArtInfo.create({
                        title: i.title,
                        descriptoin: i.descriptoin,
                        artId: art.id
                    }))
            }

            // if(artistId){
            //     artistId = JSON.parse(artistId)
            //     artistId.forEach(i =>
            //         ArtArtist.create({
            //             artistId: i.artistId,
            //             artId: art.id
            //         }))
            //     }

           
            return res.json(art)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
        
    }

    async edit(req, res) {

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

