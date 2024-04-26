"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("userprofiles", "token", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("userprofiles", "verified", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
    await queryInterface.addColumn("userprofiles", "profile_url", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("userprofiles", "verification_token", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("userprofiles", "token");
    await queryInterface.removeColumn("userprofiles", "verified");
    await queryInterface.removeColumn("userprofiles", "profile_url");
    await queryInterface.removeColumn("userprofiles", "verification_token");
  },
};
