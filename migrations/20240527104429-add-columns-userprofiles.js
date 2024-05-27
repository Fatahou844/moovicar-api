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
    await queryInterface.addColumn("UserProfiles", "AcceptanceRate", {
      type: Sequelize.FLOAT,
      allowNull: true, // ou false, selon vos besoins
    });
    await queryInterface.addColumn("UserProfiles", "ResponseRate", {
      type: Sequelize.FLOAT,
      allowNull: true, // ou false, selon vos besoins
    });
    await queryInterface.addColumn("UserProfiles", "EngagementRate", {
      type: Sequelize.FLOAT,
      allowNull: true, // ou false, selon vos besoins
    });
    await queryInterface.addColumn("UserProfiles", "EvaluationNumber", {
      type: Sequelize.INTEGER,
      allowNull: true, // ou false, selon vos besoins
    });
    await queryInterface.addColumn("UserProfiles", "Finalizedtrips", {
      type: Sequelize.INTEGER,
      allowNull: true, // ou false, selon vos besoins
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("UserProfiles", "AcceptanceRate");
    await queryInterface.removeColumn("UserProfiles", "ResponseRate");
    await queryInterface.removeColumn("UserProfiles", "EngagementRate");
    await queryInterface.removeColumn("UserProfiles", "EvaluationNumber");
    await queryInterface.removeColumn("UserProfiles", "Finalizedtrips");
  },
};
