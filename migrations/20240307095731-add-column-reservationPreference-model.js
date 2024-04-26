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
    await queryInterface.addColumn("reservationpreferences", "vehiculeId", {
      type: Sequelize.INTEGER,
      references: {
        model: "vehicles", // Assurez-vous que c'est le nom correct de la table option
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.removeColumn(
      "reservationpreferences",
      "reservationId"
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("reservationpreferences", "vehiculeId");
  },
};
