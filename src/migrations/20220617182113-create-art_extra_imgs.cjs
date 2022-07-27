module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('art_extra_imgs', {
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
      },
      img: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('art_extra_imgs');
  },
};
