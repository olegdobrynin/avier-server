import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate({
      Artist, Mark, MarkArt, UserArtLike,
    }) {
      this.hasMany(MarkArt, { foreignKey: 'mark_id', hooks: true, onDelete: 'CASCADE' });
      this.hasOne(Mark, { foreignKey: 'user_id', hooks: true, onDelete: 'CASCADE' });
      this.hasMany(Artist, { foreignKey: 'user_id', as: 'artists' });
      this.hasMany(UserArtLike, {
        foreignKey: 'user_id', as: 'likes', onDelete: 'CASCADE', hooks: true,
      });
    }

    toJSON() {
      return { ...this.get(), password: undefined };
    }
  }

  User.init({
    login: {
      type: DataTypes.STRING(32),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: 'user',
    },
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'users',
    modelName: 'User',
  });

  return User;
};
