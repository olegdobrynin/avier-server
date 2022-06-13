import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class MarkArt extends Model {
    static associate() {}
  }

  MarkArt.init({
    mark_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'marks',
      },
    },
    art_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'arts',
      },
    },
  }, {
    sequelize,
    timestamps: false,
    tableName: 'mark_arts',
    modelName: 'MarkArt',
  });

  return MarkArt;
};
