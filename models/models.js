const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    login: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
})

const Mark = sequelize.define('mark', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const MarkArt = sequelize.define('mark_art', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Art = sequelize.define('art', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    year: {type: DataTypes.INTEGER},
    about: {type: DataTypes.TEXT},
    city: {type: DataTypes.STRING},
    img: {type: DataTypes.STRING},
    like: {type: DataTypes.INTEGER},
})

const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Artist = sequelize.define('artist', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    bio: {type: DataTypes.STRING},
    img: {type: DataTypes.STRING},
})

const Folder = sequelize.define('folder', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.INTEGER},
})

const Like = sequelize.define('like', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    like: {type: DataTypes.BOOLEAN, defaultValue: false},
})

const Request = sequelize.define('request', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
   })

const ArtInfo = sequelize.define('art_info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
})

const TypeArtist = sequelize.define('type_artist', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const ArtArtist = sequelize.define('art_artist', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const UserArtist = sequelize.define('user_artist', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const ArtFolder = sequelize.define('art_folder', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})


User.hasOne(Mark)
Mark.belongsTo(User)

User.hasMany(Like)
Like.belongsTo(User)

User.hasMany(Request)
Request.belongsTo(User)

Mark.hasMany(MarkArt)
MarkArt.belongsTo(Mark)

Art.hasMany(MarkArt)
MarkArt.belongsTo(Art)

Art.hasMany(Like)
Like.belongsTo(Art)

Art.hasMany(ArtInfo, {as: 'info'})
ArtInfo.belongsTo(Art)

Artist.hasMany(Request)
Request.belongsTo(Artist)

Artist.hasMany(Folder)
Folder.belongsTo(Artist)

Type.hasMany(Art)
Art.belongsTo(Type)

Type.belongsToMany(Artist, {through: TypeArtist})
Artist.belongsToMany(Type, {through: TypeArtist})

Artist.belongsToMany(Art, {through: ArtArtist})
Art.belongsToMany(Artist, {as: 'artist', through: ArtArtist})

User.belongsToMany(Artist, {through: UserArtist})
Artist.belongsToMany(User, {through: UserArtist})

Art.belongsToMany(Folder, {through: ArtFolder})
Folder.belongsToMany(Art, {through: ArtFolder})

module.exports = {
    User,
    Mark,
    MarkArt,
    Art,
    ArtInfo,
    ArtArtist,
    Like,
    Request,
    Artist,
    Type,
    Folder
}