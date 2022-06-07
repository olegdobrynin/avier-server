const uuid = require('uuid')
const path = require('path')
const {Art, ArtInfo, Artist, ArtArtist} = require('../models/models')
const ApiError = require('../error/ApiError')

class ArtController {

    async create(req, res, next) {
        try {
            console.log(req.body);
            let {name, about, city, year, typeId, artistId, info} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const art = await Art.create({name, about, city, year, typeId, img: fileName})

            if(info){
                info = JSON.parse(info)
                info.forEach(({title, description}) =>
                    ArtInfo.create({
                        artId: art.id,
                        title,
                        description
                    }))
            }

            if(artistId){
                // artistId = JSON.parse(artistId)
                artistId.forEach(({ artistId }) =>
                    ArtArtist.create({
                        artId: art.id,
                        artistId,
                    }))
                }

           
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
                include: [{model: ArtInfo, as: 'info'}, {model: Artist, as: 'artist'}],
            }
        )
        return res.json(art)
    }
    
    async delete(req, res) {

    }

}

module.exports = new ArtController()