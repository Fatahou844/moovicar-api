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
    await queryInterface.addColumn("Vehicles", "CertificatImmatriculation", {
      type: Sequelize.BOOLEAN,
      allowNull: true, // ou false, selon vos besoins
    });
    await queryInterface.addColumn("Vehicles", "Assurance", {
      type: Sequelize.BOOLEAN,
      allowNull: true, // ou false, selon vos besoins
    });
    await queryInterface.addColumn("Vehicles", "ControleTechnique", {
      type: Sequelize.BOOLEAN,
      allowNull: true, // ou false, selon vos besoins
    });
    await queryInterface.addColumn("Vehicles", "AutorizationProprietaire", {
      type: Sequelize.BOOLEAN,
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
    await queryInterface.removeColumn("Vehicles", "CertificatImmatriculation");
    await queryInterface.removeColumn("Vehicles", "Assurance");

    await queryInterface.removeColumn("Vehicles", "ControleTechnique");
    await queryInterface.removeColumn("Vehicles", "AutorizationProprietaire");
  },
};
