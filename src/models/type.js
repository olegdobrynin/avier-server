import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Type extends Model {}

  Type.init({
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'types',
    modelName: 'Type',
  });

  return Type;
};
