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
    await queryInterface.changeColumn(
      "reservationpreferences",
      "reservationsInstantanne",
      {
        type: Sequelize.ENUM("0", "1"), // Modifiez le type et la précision selon vos besoins
        allowNull: false,
        defaultValue: "0", // Assurez-vous que cette valeur correspond à celle actuellement définie dans votre modèle
      }
    );
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
