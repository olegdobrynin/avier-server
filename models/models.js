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

const MarkLot = sequelize.define('mark_lot', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Lot = sequelize.define('lot', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
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

const LotInfo = sequelize.define('lot_info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
})

const TypeArtist = sequelize.define('type_artist', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const LotArtist = sequelize.define('lot_artist', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const UserArtist = sequelize.define('user_artist', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const LotFolder = sequelize.define('lot_folder', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})


User.hasOne(Mark)
Mark.belongsTo(User)

User.hasMany(Like)
Like.belongsTo(User)

User.hasMany(Request)
Request.belongsTo(User)

Mark.hasMany(MarkLot)
MarkLot.belongsTo(Mark)

Lot.hasMany(MarkLot)
MarkLot.belongsTo(Lot)

Lot.hasMany(Like)
Like.belongsTo(Lot)

Lot.hasMany(LotInfo, {as: 'info'})
LotInfo.belongsTo(Lot)

Artist.hasMany(Request)
Request.belongsTo(Artist)

Artist.hasMany(Folder)
Folder.belongsTo(Artist)

Type.hasMany(Lot)
Lot.belongsTo(Type)

Type.belongsToMany(Artist, {through: TypeArtist})
Artist.belongsToMany(Type, {through: TypeArtist})

Lot.belongsToMany(Artist, {through: LotArtist})
Artist.belongsToMany(Lot, {through: LotArtist})

User.belongsToMany(Artist, {through: UserArtist})
Artist.belongsToMany(User, {through: UserArtist})

Lot.belongsToMany(Folder, {through: LotFolder})
Folder.belongsToMany(Lot, {through: LotFolder})

module.exports = {
    User,
    Mark,
    MarkLot,
    Lot,
    LotInfo,
    Like,
    Request,
    Artist,
    Type,
    Folder
}