"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(
      "DeliveryLocations",
      "deliveryLocationActive",
      {
        type: Sequelize.ENUM("0", "1"),
        allowNull: true, // ou false, selon vos besoins
      }
    );
    await queryInterface.addColumn("DeliveryLocations", "deliveryCosts", {
      type: Sequelize.FLOAT,
      allowNull: true, // ou false, selon vos besoins
    });
    await queryInterface.addColumn("DeliveryLocations", "PriseEnChargeMethod", {
      type: Sequelize.ENUM("0", "1", "2", "3"),
      allowNull: true, // ou false, selon vos besoins
    });
    await queryInterface.addColumn("DeliveryLocations", "MoreInfo", {
      type: Sequelize.STRING,
      allowNull: true, // ou false, selon vos besoins
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn(
      "DeliveryLocations",
      "deliveryLocationActive"
    );
    await queryInterface.removeColumn("DeliveryLocations", "deliveryCosts");
    await queryInterface.removeColumn(
      "DeliveryLocations",
      "PriseEnChargeMethod"
    );
    await queryInterface.removeColumn("DeliveryLocations", "MoreInfo");
  },
};
