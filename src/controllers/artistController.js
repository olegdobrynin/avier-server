const uuid = require('uuid')
const path = require('path')
const {Artist} = require('../models/models')
const ApiError = require('../error/ApiError')

class ArtistController {

    async create(req, res, next) {
    try {
            const {name, bio} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
    
            const artist = await Artist.create({name, bio, img: fileName})
    
            return res.json(artist)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async edit(req, res) {

    }

    async getAll(req, res) {
        const artists = await Artist.findAll()
        return res.json(artists)
    }
    
    async delete(req, res) {

    }

}

module.exports = new ArtistController()