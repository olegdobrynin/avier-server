import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class UserArtLike extends Model {
    static associate({ Art, User }) {
      this.belongsTo(Art, { foreignKey: 'art_id' });
      this.belongsTo(User, { foreignKey: 'user_id' });
    }
  }

  UserArtLike.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
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
    tableName: 'user_art_likes',
    modelName: 'UserArtLike',
  });

  return UserArtLike;
};
