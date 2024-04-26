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
    await queryInterface.addColumn("DeliveryLocations", "deliveryCoords", {
      type: Sequelize.STRING,
      allowNull: true, // ou false, selon vos besoins
    });
    await queryInterface.addColumn("DeliveryLocations", "deliveryAddressName", {
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
    await queryInterface.removeColumn("DeliveryLocations", "deliveryCoords");
    await queryInterface.removeColumn(
      "DeliveryLocations",
      "deliveryAddressName"
    );
  },
};
