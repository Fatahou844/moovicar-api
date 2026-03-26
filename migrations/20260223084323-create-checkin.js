"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Checkins", {
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
      kmStart: {
        type: Sequelize.INTEGER,
      },
      fuelStart: {
        type: Sequelize.STRING,
      },
      signature: {
        type: Sequelize.STRING,
      },
      validatedBy: {
        type: Sequelize.STRING,
      },
      validatedAt: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("Checkins");
  },
};
