"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("vehicles", "principalPhotos", {
      type: Sequelize.STRING,
      defaultValue: null,
    });
    await queryInterface.addColumn("vehicles", "lateralPhotos", {
      type: Sequelize.STRING,
      defaultValue: null,
    });
    await queryInterface.addColumn("vehicles", "interiorPhotos", {
      type: Sequelize.STRING,
      defaultValue: null,
    });
    await queryInterface.addColumn("vehicles", "SupplementPhotos", {
      type: Sequelize.STRING,
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("vehicles", "principalPhoto");
    await queryInterface.removeColumn("vehicles", "lateralPhotos");

    await queryInterface.removeColumn("vehicles", "interiorPhotos");

    await queryInterface.removeColumn("vehicles", "SupplementPhotos");
  },
};
