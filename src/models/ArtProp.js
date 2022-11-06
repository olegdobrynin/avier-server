import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class ArtProp extends Model {
    static associate({ Art }) {
      this.belongsTo(Art, { foreignKey: 'artId' });
    }

    static get model() {
      return {
        model: ArtProp,
        as: 'properties',
        attributes: ['title', 'description'],
      };
    }
  }

  ArtProp.init({
    artId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'arts',
      },
    },
    title: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    sequelize,
    underscored: true,
    timestamps: false,
    tableName: 'art_properties',
    modelName: 'ArtProp',
  });

  return ArtProp;
};
