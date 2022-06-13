import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Mark extends Model {
    static associate({ Art, MarkArt, User }) {
      this.belongsTo(User, { foreignKey: 'user_id' });
      this.belongsToMany(Art, { through: MarkArt, foreignKey: 'mark_id', as: 'arts' });
    }
  }

  Mark.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
      },
    },
  }, {
    sequelize,
    timestamps: false,
    tableName: 'marks',
    modelName: 'Mark',
  });

  return Mark;
};
