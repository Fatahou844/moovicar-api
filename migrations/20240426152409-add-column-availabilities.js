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
    try {
      await queryInterface.addColumn("Availabilities", "CustomDate", {
        type: Sequelize.DATEONLY,
        allowNull: true, // ou false, selon vos besoins
      });
      await queryInterface.addColumn("Availabilities", "DateCustomised", {
        type: Sequelize.DATEONLY,
        allowNull: true, // ou false, selon vos besoins
      });
    } catch (error) {
      console.error("Error adding column CustomDate:", error.message);
      // Continue with the next migration
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("Availabilities", "CustomDate");
    await queryInterface.removeColumn("Availabilities", "DateCustomised");
  },
};
