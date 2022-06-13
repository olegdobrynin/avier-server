import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class ArtProp extends Model {
    static associate({ Art }) {
      this.belongsTo(Art, { foreignKey: 'art_id' });
    }
  }

  ArtProp.init({
    art_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'arts',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'art_properties',
    modelName: 'ArtProp',
  });

  return ArtProp;
};
