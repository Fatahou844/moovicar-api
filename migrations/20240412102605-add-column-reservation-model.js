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
    await queryInterface.addColumn("reservations", "vehiculeAnnonceId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "vehiculeannonces", // Assurez-vous que c'est le nom correct de la table option
        key: "vehiculeAnnonceId",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE", // ou false, selon vos besoins
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("reservations", "vehiculeAnnonceId");
  },
};
