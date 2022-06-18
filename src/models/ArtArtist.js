import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class ArtArtist extends Model {}

  ArtArtist.init({
    art_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'arts',
      },
    },
    artist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'artists',
      },
    },
  }, {
    sequelize,
    timestamps: false,
    tableName: 'art_artists',
    modelName: 'ArtArtist',
  });

  return ArtArtist;
};
