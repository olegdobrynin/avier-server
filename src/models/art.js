import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Art extends Model {
    static associate({
      ArtProp, Artist, ArtArtist, Type,
    }) {
      this.hasMany(ArtProp, {
        foreignKey: 'art_id', as: 'properties', hooks: true, onDelete: 'CASCADE',
      });
      this.hasMany(ArtArtist, { foreignKey: 'art_id', hooks: true, onDelete: 'CASCADE' });
      this.belongsTo(Type, { foreignKey: 'type_id', as: 'type' });
      this.belongsToMany(Artist, { through: ArtArtist, foreignKey: 'art_id', as: 'artists' });
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
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
    },
    about: {
      type: DataTypes.TEXT,
    },
    city: {
      type: DataTypes.STRING,
    },
    img: {
      type: DataTypes.STRING,
    },
    like: {
      type: DataTypes.INTEGER,
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
