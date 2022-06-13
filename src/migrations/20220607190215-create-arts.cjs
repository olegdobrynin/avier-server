'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('arts', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'types',
        },
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      year: {
        type: Sequelize.INTEGER,
      },
      about: {
        type: Sequelize.TEXT,
      },
      city: {
        type: Sequelize.STRING(25),
      },
      img: {
        type: Sequelize.STRING(40),
        allowNull: false,
        defaultValue: 'default.jpg',
      },
      like: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('arts');
  },
};
