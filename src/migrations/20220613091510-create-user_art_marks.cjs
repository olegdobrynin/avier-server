module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_art_marks', {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      art_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'arts',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('user_art_marks');
  },
};
