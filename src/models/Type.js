import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Type extends Model {
    static associate({ Art }) {
      this.hasMany(Art, { foreignKey: 'type_id' });
    }
  }

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
