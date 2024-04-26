"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ReservationPreferences", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      reservationId: {
        type: Sequelize.INTEGER,
        references: {
          model: "reservations", // Assurez-vous que c'est le nom correct de la table option
          key: "reservationId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      reservationsInstantanne: {
        type: Sequelize.BOOLEAN,
      },
      home_preavis: {
        type: Sequelize.ENUM("0", "1", "2", "3", "4", "5", "6"),
        defaultValue: "0",
      },
      home_minDureeVoyage: {
        type: Sequelize.ENUM("0", "1", "2", "3", "4"),
      },
      home_maxDureeVoyage: {
        type: Sequelize.ENUM("0", "1", "2", "3", "4", "5"),
      },
      locationDelivery_preavis: {
        type: Sequelize.ENUM("0", "1", "2", "3", "4", "5", "6"),
        defaultValue: "0",
      },
      locationDelivery_minDureeVoyage: {
        type: Sequelize.ENUM("0", "1", "2", "3", "4"),
      },
      locationDelivery_maxDureeVoyage: {
        type: Sequelize.ENUM("0", "1", "2", "3", "4", "5"),
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
    await queryInterface.dropTable("ReservationPreferences");
  },
};
