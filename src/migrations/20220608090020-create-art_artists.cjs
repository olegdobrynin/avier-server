module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('art_artists', {
      art_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'arts',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      artist_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'artists',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('art_artists');
  },
};
