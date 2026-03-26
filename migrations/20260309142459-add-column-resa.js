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
    await queryInterface.addColumn("Reservations", "isPaidOut", {
      type: Sequelize.BOOLEAN,
      allowNull: false, // ou false, selon vos besoins
      defaultValue: false,
    });
    await queryInterface.addColumn("Reservations", "payoutId", {
      type: Sequelize.BOOLEAN,
      allowNull: false, // ou false, selon vos besoins
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("Reservations", "isPaidOut");
    await queryInterface.removeColumn("Reservations", "payoutId");
  },
};
