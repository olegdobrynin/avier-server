import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Type extends Model {
    static associate({ Art }) {
      this.hasMany(Art, { foreignKey: 'typeId' });
    }
  }

  Type.init({
    name: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false,
    },
  }, {
    sequelize,
    underscored: true,
    tableName: 'types',
    modelName: 'Type',
  });

  return Type;
};
