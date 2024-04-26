"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("DeliveryLocations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      addressEmplacementDelivery: {
        type: Sequelize.STRING,
      },
      annonceId: {
        type: Sequelize.INTEGER,
        references: {
          model: "VehiculeAnnonces", // Assurez-vous que c'est le nom correct de la table option
          key: "vehiculeAnnonceId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      customPlace: {
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
    await queryInterface.dropTable("DeliveryLocations");
  },
};
