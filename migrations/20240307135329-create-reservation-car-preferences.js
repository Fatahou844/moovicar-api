"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ReservationCarPreferences", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      vehiculeId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Vehicles", // Assurez-vous que c'est le nom correct de la table option
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      reservationsInstantanne: {
        type: Sequelize.BOOLEAN,
      },
      home_preavis: {
        type: Sequelize.ENUM("0", "1", "2", "3", "4", "5", "6"),
      },
      home_minDureeVoyage: {
        type: Sequelize.ENUM("0", "1", "2", "3", "4"),
      },
      home_maxDureeVoyage: {
        type: Sequelize.ENUM("0", "1", "2", "3", "4", "5"),
      },
      locationDelivery_preavis: {
        type: Sequelize.ENUM("0", "1", "2", "3", "4", "5", "6"),
      },
      locationDelivery_minDureeVoyage: {
        type: Sequelize.ENUM("0", "1", "2", "3", "4"),
      },
      locationDelivery_maxDureeVoyage: {
        type: Sequelize.ENUM("0", "1", "2", "3", "4", "5"),
      },
      locationDeliveryPeriodTempo: {
        type: Sequelize.ENUM("0", "1", "2", "3", "4", "5", "6", "7", "8", "9"),
      },
      HomePeriodTempo: {
        type: Sequelize.ENUM("0", "1", "2", "3", "4", "5", "6", "7", "8", "9"),
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
    await queryInterface.dropTable("ReservationCarPreferences");
  },
};
