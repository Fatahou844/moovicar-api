"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Paiements", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      reservationId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Reservations", // Assurez-vous que c'est le nom correct de la table option
          key: "reservationId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      amount: {
        type: Sequelize.FLOAT,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "UserProfiles", // Assurez-vous que c'est le nom correct de la table modèle
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      paiementData: {
        type: Sequelize.DATE,
      },
      paiementStatus: {
        type: Sequelize.ENUM("0", "1", "2"),
      },
      paiement_method: {
        type: Sequelize.ENUM("card", "bank", "paypal"),
      },
      transactionID: {
        type: Sequelize.STRING,
      },
      notes: {
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
    await queryInterface.dropTable("Paiements");
  },
};
