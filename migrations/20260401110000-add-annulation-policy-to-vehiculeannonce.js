"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("VehiculeAnnonces", "annulationPolicy", {
      type: Sequelize.ENUM("flexible", "moderate", "strict"),
      allowNull: false,
      defaultValue: "moderate",
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn("VehiculeAnnonces", "annulationPolicy");
  },
};
