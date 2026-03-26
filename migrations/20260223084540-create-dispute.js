"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Disputes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      reservationId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Reservations", // Assurez-vous que c'est le nom correct de la table option
          key: "reservationId",
        },
      },
      reportedBy: {
        type: Sequelize.INTEGER,
      },
      description: {
        type: Sequelize.TEXT,
      },
      status: {
        type: Sequelize.ENUM("open", "under_review", "resolved", "rejected"),
        defaultValue: "open",
      },
      resolution: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Disputes");
  },
};
