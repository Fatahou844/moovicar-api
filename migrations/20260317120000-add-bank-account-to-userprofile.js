"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("UserProfiles", "stripeBankAccountId", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("UserProfiles", "bankLast4", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("UserProfiles", "stripeBankAccountId");
    await queryInterface.removeColumn("UserProfiles", "bankLast4");
  },
};
