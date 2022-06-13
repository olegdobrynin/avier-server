import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Artist extends Model {
    static associate({ User }) {
      this.belongsTo(User, { foreignKey: 'user_id' });
    }
  }

  Artist.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
      },
    },
    bio: {
      type: DataTypes.STRING,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'artists',
    modelName: 'Artist',
  });

  return Artist;
};
