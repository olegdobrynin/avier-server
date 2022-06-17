import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class ArtExtraImg extends Model {
    static associate({ Art }) {
      this.belongsTo(Art, { foreignKey: 'art_id' });
    }
  }

  ArtExtraImg.init({
    art_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'arts',
      },
    },
    img: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: false,
    tableName: 'art_extra_imgs',
    modelName: 'ArtExtraImg',
  });

  return ArtExtraImg;
};
