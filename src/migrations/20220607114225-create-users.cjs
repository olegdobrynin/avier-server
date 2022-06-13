'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      login: {
        type: Sequelize.STRING(32),
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(60),
        allowNull: false,
      },
      role: {
        type: Sequelize.STRING(5),
        allowNull: false,
        defaultValue: 'USER',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
