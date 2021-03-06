import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Artist extends Model {
    static associate({ Art, ArtArtist, User }) {
      this.hasMany(ArtArtist, { foreignKey: 'artist_id', hooks: true, onDelete: 'CASCADE' });
      this.belongsTo(User, { foreignKey: 'user_id' });
      this.belongsToMany(Art, { through: ArtArtist, foreignKey: 'artist_id', as: 'arts' });
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
    user_id: {
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
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'artists',
    modelName: 'Artist',
  });

  return Artist;
};
