import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Mark extends Model {
    static associate({ Art, MarkArt, User }) {
      this.belongsTo(User, { foreignKey: 'userId' });
      this.belongsToMany(Art, { through: MarkArt, foreignKey: 'markId', as: 'arts' });
    }
  }

  Mark.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
      },
    },
  }, {
    sequelize,
    underscored: true,
    timestamps: false,
    tableName: 'marks',
    modelName: 'Mark',
  });

  return Mark;
};
