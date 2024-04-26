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
    await queryInterface.addColumn("Unavailabilities", "type", {
      type: Sequelize.ENUM("0", "1"),
      allowNull: true, // ou false, selon vos besoins
      defaultValue: "1",
    });

    await queryInterface.addColumn("Unavailabilities", "WeekDAY", {
      type: Sequelize.ENUM("0", "1", "2", "3", "4", "5", "6"),
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
  },
};
