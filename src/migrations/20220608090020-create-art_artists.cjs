'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('art_artists', {
      art_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'arts',
        },
      },
      artist_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'artists',
        },
      },
   });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('art_artists');
  }
};
