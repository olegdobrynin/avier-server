import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class UserArtMark extends Model {
    static associate({ Art, User }) {
      this.belongsTo(Art, { foreignKey: 'artId' });
      this.belongsTo(User, { foreignKey: 'userId' });
    }
  }

  UserArtMark.init({
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
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
    tableName: 'user_art_marks',
    modelName: 'UserArtMark',
  });

  return UserArtMark;
};
