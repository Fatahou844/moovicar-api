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
    await queryInterface.addColumn("UserProfiles", "OpenID", {
      type: Sequelize.STRING,
      defaultValue: null,
    });
    await queryInterface.addColumn("UserProfiles", "access_tokenPaypal", {
      type: Sequelize.STRING,
      defaultValue: null,
    });
    await queryInterface.addColumn("UserProfiles", "app_id", {
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
    await queryInterface.removeColumn("UserProfiles", "OpenID");
    await queryInterface.removeColumn("UserProfiles", "access_tokenPaypal");

    await queryInterface.removeColumn("UserProfiles", "app_id");
  },
};
