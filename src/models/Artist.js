import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Artist extends Model {
    static associate({ Art, ArtArtist, User }) {
      this.hasMany(ArtArtist, { foreignKey: 'artistId', hooks: true, onDelete: 'CASCADE' });
      this.belongsTo(User, { foreignKey: 'userId' });
      this.belongsToMany(Art, { through: ArtArtist, foreignKey: 'artistId', as: 'arts' });
    }

    static getModel(...attributes) {
      return {
        model: Artist,
        as: 'artists',
        attributes,
        through: { attributes: [] },
      };
    }
  }

  Artist.init({
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
      },
    },
    bio: {
      type: DataTypes.STRING,
    },
    img: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: 'default.jpg',
    },
  }, {
    sequelize,
    underscored: true,
    tableName: 'artists',
    modelName: 'Artist',
  });

  return Artist;
};
