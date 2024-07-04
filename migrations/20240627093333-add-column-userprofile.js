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
    await queryInterface.addColumn("UserProfiles", "last4", {
      type: Sequelize.STRING,
      allowNull: true, // ou false, selon vos besoins
    });
    await queryInterface.addColumn("UserProfiles", "exp_month", {
      type: Sequelize.STRING,
      allowNull: true, // ou false, selon vos besoins
    });
    await queryInterface.addColumn("UserProfiles", "exp_year", {
      type: Sequelize.STRING,
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
    await queryInterface.removeColumn("UserProfiles", "last4");
    await queryInterface.removeColumn("UserProfiles", "exp_month");
    await queryInterface.removeColumn("UserProfiles", "exp_year");
  },
};
