import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class ArtExtraImg extends Model {
    static associate({ Art }) {
      this.belongsTo(Art, { foreignKey: 'artId' });
    }

    static get model() {
      return {
        model: ArtExtraImg,
        as: 'extraImgs',
        attributes: ['img'],
      };
    }
  }

  ArtExtraImg.init({
    artId: {
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
    underscored: true,
    timestamps: false,
    tableName: 'art_extra_imgs',
    modelName: 'ArtExtraImg',
  });

  return ArtExtraImg;
};
