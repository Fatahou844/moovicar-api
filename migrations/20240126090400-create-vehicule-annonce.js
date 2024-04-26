"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("VehiculeAnnonces", {
      vehiculeAnnonceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      reservationPrice: {
        type: Sequelize.DECIMAL,
      },
      locationMode: {
        type: Sequelize.ENUM("0", "1"),
      },
      vehiculeType: {
        type: Sequelize.STRING,
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
      minDistanceInclus: {
        type: Sequelize.ENUM("0", "1"),
      },
      additionalDriverInclus: {
        type: Sequelize.ENUM("0", "1"),
      },
      annulationAnnonceDelayBefore: {
        type: Sequelize.ENUM("0", "1"),
      },
      carburantInclus: {
        type: Sequelize.ENUM("0", "1"),
      },
      supplementJeuneDriver: {
        type: Sequelize.ENUM("0", "1"),
      },
      distanceOutMin: {
        type: Sequelize.DECIMAL,
      },
      locationAddress: {
        type: Sequelize.STRING,
      },
      locationCoordinates: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("VehiculeAnnonces");
  },
};
