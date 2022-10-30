import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class UserArtLike extends Model {
    static associate({ Art, User }) {
      this.belongsTo(Art, { foreignKey: 'artId' });
      this.belongsTo(User, { foreignKey: 'userId' });
    }
  }

  UserArtLike.init({
    userId: {
      type: DataTypes.INTEGER,
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
    tableName: 'user_art_likes',
    modelName: 'UserArtLike',
  });

  return UserArtLike;
};
