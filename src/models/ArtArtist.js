import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class ArtArtist extends Model {}

  ArtArtist.init({
    artId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'arts',
      },
    },
    artistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'artists',
      },
    },
  }, {
    sequelize,
    underscored: true,
    timestamps: false,
    tableName: 'art_artists',
    modelName: 'ArtArtist',
  });

  return ArtArtist;
};
