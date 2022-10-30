import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class MarkArt extends Model {}

  MarkArt.init({
    markId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'marks',
      },
    },
    artId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'arts',
      },
    },
  }, {
    sequelize,
    underscored: true,
    timestamps: false,
    tableName: 'mark_arts',
    modelName: 'MarkArt',
  });

  return MarkArt;
};
