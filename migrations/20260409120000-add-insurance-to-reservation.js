"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Reservations", "insurancePlanId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: "InsurancePlans", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
    await queryInterface.addColumn("Reservations", "insuranceFee", {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: null,
      comment: "Montant total payé pour l'assurance (calculé à la réservation)",
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn("Reservations", "insurancePlanId");
    await queryInterface.removeColumn("Reservations", "insuranceFee");
  },
};
