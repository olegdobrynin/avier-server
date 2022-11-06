module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mark_arts', {
      mark_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'marks',
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
    await queryInterface.dropTable('mark_arts');
  },
};
