"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Reservations", "distanceMaxKm", {
      type: Sequelize.INTEGER,
      defaultValue: null,
      allowNull: true,
      comment: "Distance max incluse dans le tarif (km)",
    });
    await queryInterface.addColumn("Reservations", "distanceParcourueKm", {
      type: Sequelize.INTEGER,
      defaultValue: null,
      allowNull: true,
      comment: "Distance réelle parcourue saisie au retour (km)",
    });
    await queryInterface.addColumn("Reservations", "prixParKmSupp", {
      type: Sequelize.FLOAT,
      defaultValue: null,
      allowNull: true,
      comment: "Prix par km supplémentaire (€)",
    });
    await queryInterface.addColumn("Reservations", "extraDistancePaymentIntentId", {
      type: Sequelize.STRING,
      defaultValue: null,
      allowNull: true,
      comment: "Stripe PaymentIntent pour les km supplémentaires",
    });
    await queryInterface.addColumn("Reservations", "extraDistancePaid", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn("Reservations", "distanceMaxKm");
    await queryInterface.removeColumn("Reservations", "distanceParcourueKm");
    await queryInterface.removeColumn("Reservations", "prixParKmSupp");
    await queryInterface.removeColumn("Reservations", "extraDistancePaymentIntentId");
    await queryInterface.removeColumn("Reservations", "extraDistancePaid");
  },
};
