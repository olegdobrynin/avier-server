import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Art extends Model {
    static associate({
      ArtExtraImg, ArtProp, Artist, ArtArtist, Type, User, UserArtLike, UserArtMark,
    }) {
      this.hasMany(ArtArtist, { foreignKey: 'artId' });
      this.hasMany(ArtExtraImg, { foreignKey: 'artId', as: 'extraImgs' });
      this.hasMany(ArtProp, { foreignKey: 'artId', as: 'properties' });
      this.hasMany(UserArtLike, { foreignKey: 'artId', as: 'like' });
      this.hasMany(UserArtMark, { foreignKey: 'artId', as: 'mark' });
      this.belongsTo(Type, { foreignKey: 'typeId', as: 'type' });
      this.belongsToMany(Artist, { through: ArtArtist, foreignKey: 'artId', as: 'artists' });
      this.belongsToMany(User, { through: UserArtMark, foreignKey: 'artId', as: 'marks' });
      this.belongsToMany(User, { through: UserArtLike, foreignKey: 'artId', as: 'likes' });
    }

    toJSON() {
      return {
        ...this.get(), extraImgs: undefined, createdAt: undefined, updatedAt: undefined,
      };
    }
  }

  Art.init({
    typeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'types',
      },
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
    },
    about: {
      type: DataTypes.TEXT,
    },
    city: {
      type: DataTypes.STRING(25),
    },
    img: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: 'default.jpg',
    },
  }, {
    sequelize,
    underscored: true,
    tableName: 'arts',
    modelName: 'Art',
  });

  return Art;
};
