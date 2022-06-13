'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mark_arts', {
      mark_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'marks',
        },
      },
      art_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'arts',
        },
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('mark_arts');
  }
};