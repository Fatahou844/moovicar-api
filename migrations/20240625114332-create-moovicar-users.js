"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("MoovicarUsers", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING, // Utilisation d'une clé primaire de type STRING
        defaultValue: Sequelize.UUIDV4, // Génération automatique d'une UUID
      },
      firstName: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
      },
      level: {
        type: Sequelize.ENUM("0", "1", "2"),
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("MoovicarUsers");
  },
};
