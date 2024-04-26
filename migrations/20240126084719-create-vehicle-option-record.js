"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("VehicleOptionRecords", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      vehicleOptionRecordId: {
        type: Sequelize.INTEGER,
      },
      vehiculeOptionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "vehicleoptions", // Assurez-vous que c'est le nom correct de la table option
          key: "vehiculeOptionId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      vehiculeId: {
        type: Sequelize.INTEGER,
        references: {
          model: "vehicles", // Assurez-vous que c'est le nom correct de la table véhicule
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
    await queryInterface.dropTable("VehicleOptionRecords");
  },
};
