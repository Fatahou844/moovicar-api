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
      "deliverylocations",
      "deliveryLocationActive",
      {
        type: Sequelize.ENUM("0", "1"),
        allowNull: true, // ou false, selon vos besoins
      }
    );
    await queryInterface.addColumn("deliverylocations", "deliveryCosts", {
      type: Sequelize.FLOAT,
      allowNull: true, // ou false, selon vos besoins
    });
    await queryInterface.addColumn("deliverylocations", "PriseEnChargeMethod", {
      type: Sequelize.ENUM("0", "1", "2", "3"),
      allowNull: true, // ou false, selon vos besoins
    });
    await queryInterface.addColumn("deliverylocations", "MoreInfo", {
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
      "deliverylocations",
      "deliveryLocationActive"
    );
    await queryInterface.removeColumn("deliverylocations", "deliveryCosts");
    await queryInterface.removeColumn(
      "deliverylocations",
      "PriseEnChargeMethod"
    );
    await queryInterface.removeColumn("deliverylocations", "MoreInfo");
  },
};
