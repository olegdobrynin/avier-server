import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate({
      Art, Artist, Mark, MarkArt, UserArtLike,
    }) {
      this.hasMany(MarkArt, { foreignKey: 'markId', hooks: true, onDelete: 'CASCADE' });
      this.hasOne(Mark, { foreignKey: 'userId', hooks: true, onDelete: 'CASCADE' });
      this.hasMany(Artist, { foreignKey: 'userId', as: 'artists' });
      this.hasMany(UserArtLike, {
        foreignKey: 'userId', as: 'like', onDelete: 'CASCADE', hooks: true,
      });
      this.belongsToMany(Art, { through: UserArtLike, foreignKey: 'userId', as: 'likes' });
    }

    toJSON() {
      return {
        ...this.get(), password: undefined, createdAt: undefined, updatedAt: undefined,
      };
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
    underscored: true,
    tableName: 'users',
    modelName: 'User',
  });

  return User;
};
