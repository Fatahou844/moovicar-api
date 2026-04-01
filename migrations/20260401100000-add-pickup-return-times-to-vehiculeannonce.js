"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("VehiculeAnnonces", "pickupTimeStart", {
      type: Sequelize.STRING(5), // format "HH:MM"
      allowNull: true,
      defaultValue: "08:00",
    });
    await queryInterface.addColumn("VehiculeAnnonces", "pickupTimeEnd", {
      type: Sequelize.STRING(5),
      allowNull: true,
      defaultValue: "20:00",
    });
    await queryInterface.addColumn("VehiculeAnnonces", "returnTimeStart", {
      type: Sequelize.STRING(5),
      allowNull: true,
      defaultValue: "08:00",
    });
    await queryInterface.addColumn("VehiculeAnnonces", "returnTimeEnd", {
      type: Sequelize.STRING(5),
      allowNull: true,
      defaultValue: "20:00",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("VehiculeAnnonces", "pickupTimeStart");
    await queryInterface.removeColumn("VehiculeAnnonces", "pickupTimeEnd");
    await queryInterface.removeColumn("VehiculeAnnonces", "returnTimeStart");
    await queryInterface.removeColumn("VehiculeAnnonces", "returnTimeEnd");
  },
};
