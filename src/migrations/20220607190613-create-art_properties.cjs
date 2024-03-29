module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('art_properties', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
      title: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('art_properties');
  },
};
