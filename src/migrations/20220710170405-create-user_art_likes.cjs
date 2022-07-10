module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_art_likes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
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
    await queryInterface.dropTable('user_art_likes');
  },
};
