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
    await queryInterface.addColumn("Vehicles", "CertificatImmatriculationDoc", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Vehicles", "AssuranceDoc", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Vehicles", "ControleTechniqueDoc", {
      type: Sequelize.STRING,
      allowNull: true,
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
      "Vehicles",
      "CertificatImmatriculationDoc",
    );
    await queryInterface.removeColumn("Vehicles", "AssuranceDoc");

    await queryInterface.removeColumn("Vehicles", "ControleTechniqueDoc");
  },
};
