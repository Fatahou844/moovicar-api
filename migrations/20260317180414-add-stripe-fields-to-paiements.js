"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Paiements", "paymentIntentId", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Paiements", "payoutId", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Paiements", "refundId", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Paiements", "paymentIntentId");
    await queryInterface.removeColumn("Paiements", "payoutId");
    await queryInterface.removeColumn("Paiements", "refundId");
  },
};
