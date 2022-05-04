const uuid = require('uuid')
const path = require('path')
const {Lot, LotInfo} = require('../models/models')
const ApiError = require('../error/ApiError')

class LotController {

    async create(req, res, next) {
        try {
            let {name, typeId, artistId, info} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const lot = await Lot.create({name, typeId, artistId, img: fileName})
    
            if(info){
                info = JSON.parse(info)
                info.forEach(i =>
                    LotInfo.create({
                        title: i.title,
                        descriptoin: i.descriptoin,
                        lotId: lot.id
                    }))
            }

           
            return res.json(lot)
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
        let lots;
        if (!artistId && !typeId) {
            lots = await Lot.findAndCountAll({limit, offset})
            }
        if (artistId && !typeId) {
            lots = await Lot.findAndCountAll({where:{artistId}, limit, offset})
            }
        if (!artistId && typeId) {
            lots = await Lot.findAndCountAll({where:{typeId}, limit, offset})            
            }
        if (artistId && typeId) {
            lots = await Lot.findAndCountAll({where:{artistId, typeId}, limit, offset})            
        }
        return res.json(lots)
    }

    async getOne(req, res) {
        const {id} = req.params
        const lot = await Lot.findOne(
            {
                where: {id},
                include: [{model: LotInfo, as: 'info'}]
            }
        )
        return res.json(lot)
    }
    
    async delete(req, res) {

    }

}

module.exports = new LotController()