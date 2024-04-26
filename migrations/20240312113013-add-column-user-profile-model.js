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
    await queryInterface.addColumn("userprofiles", "OpenID", {
      type: Sequelize.STRING,
      defaultValue: null,
    });
    await queryInterface.addColumn("userprofiles", "access_tokenPaypal", {
      type: Sequelize.STRING,
      defaultValue: null,
    });
    await queryInterface.addColumn("userprofiles", "app_id", {
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
    await queryInterface.removeColumn("userprofiles", "OpenID");
    await queryInterface.removeColumn("userprofiles", "access_tokenPaypal");

    await queryInterface.removeColumn("userprofiles", "app_id");
  },
};
