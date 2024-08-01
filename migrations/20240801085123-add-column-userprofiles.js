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

    await queryInterface.addColumn("UserProfiles", "PermisConduireDoc", {
      type: Sequelize.STRING,
      allowNull: true, // ou false, selon vos besoins
    });
    await queryInterface.addColumn("UserProfiles", "PieceIdentityDoc", {
      type: Sequelize.STRING,
      allowNull: true, // ou false, selon vos besoins
    });

    await queryInterface.addColumn("UserProfiles", "ImmatriculationDoc", {
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
    await queryInterface.removeColumn("UserProfiles", "PermisConduireDoc");
    await queryInterface.removeColumn("UserProfiles", "PieceIdentityDoc");
    await queryInterface.removeColumn("UserProfiles", "ImmatriculationDoc");
  },
};
