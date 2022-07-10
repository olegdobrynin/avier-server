import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Art extends Model {
    static associate({
      ArtExtraImg, ArtProp, Artist, ArtArtist, Mark, MarkArt, Type, UserArtLike,
    }) {
      this.hasMany(ArtArtist, { foreignKey: 'art_id', hooks: true, onDelete: 'CASCADE' });
      this.hasMany(ArtExtraImg, {
        foreignKey: 'art_id', as: 'extraImgs', hooks: true, onDelete: 'CASCADE',
      });
      this.hasMany(ArtProp, {
        foreignKey: 'art_id', as: 'properties', hooks: true, onDelete: 'CASCADE',
      });
      this.hasMany(MarkArt, {
        foreignKey: 'art_id', as: 'mark', hooks: true, onDelete: 'CASCADE',
      });
      this.hasMany(UserArtLike, {
        foreignKey: 'art_id', as: 'likes', hooks: true, onDelete: 'CASCADE',
      });
      this.belongsTo(Type, { foreignKey: 'type_id', as: 'type' });
      this.belongsToMany(Artist, { through: ArtArtist, foreignKey: 'art_id', as: 'artists' });
      this.belongsToMany(Mark, { through: MarkArt, foreignKey: 'art_id', as: 'marks' });
    }

    toJSON() {
      return { ...this.get(), extraImgs: undefined };
    }
  }

  Art.init({
    type_id: {
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
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'arts',
    modelName: 'Art',
  });

  return Art;
};
