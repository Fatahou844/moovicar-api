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
    await queryInterface.addColumn("Vehicles", "principalPhotos", {
      type: Sequelize.STRING,
      defaultValue: null,
    });
    await queryInterface.addColumn("Vehicles", "lateralPhotos", {
      type: Sequelize.STRING,
      defaultValue: null,
    });
    await queryInterface.addColumn("Vehicles", "interiorPhotos", {
      type: Sequelize.STRING,
      defaultValue: null,
    });
    await queryInterface.addColumn("Vehicles", "SupplementPhotos", {
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
    await queryInterface.removeColumn("Vehicles", "principalPhoto");
    await queryInterface.removeColumn("Vehicles", "lateralPhotos");

    await queryInterface.removeColumn("Vehicles", "interiorPhotos");

    await queryInterface.removeColumn("Vehicles", "SupplementPhotos");
  },
};
