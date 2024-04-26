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
    await queryInterface.addColumn(
      "ReservationPreferences",
      "HomePeriodTempo",
      {
        type: Sequelize.ENUM("0", "1", "2", "3", "4", "5", "6", "7", "8", "9"),
        allowNull: true, // ou false, selon vos besoins
      }
    );

    await queryInterface.addColumn(
      "ReservationPreferences",
      "LocationDelivereyPeriodTempo",
      {
        type: Sequelize.ENUM("0", "1", "2", "3", "4", "5", "6", "7", "8", "9"),
        allowNull: true, // ou false, selon vos besoins
      }
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn(
      "ReservationPreferences",
      "LocationDelivereyPeriodTempo"
    );
    await queryInterface.removeColumn(
      "ReservationPreferences",
      "HomePeriodTempo"
    );
  },
};
