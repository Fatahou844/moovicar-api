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
    await queryInterface.addColumn("Checkins", "photos", {
      type: Sequelize.TEXT, // on stocke JSON.stringify en string
      allowNull: true, // si tu veux que ce soit optionnel
    });

    await queryInterface.addColumn("Checkouts", "photos", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // Supprimer les colonnes si on rollback
    await queryInterface.removeColumn("Checkins", "photos");
    await queryInterface.removeColumn("Checkouts", "photos");
  },
};
