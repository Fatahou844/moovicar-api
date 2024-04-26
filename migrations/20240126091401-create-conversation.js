"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Conversations", {
      conversationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      allMediaRemoved: {
        type: Sequelize.BOOLEAN,
      },
      authorDriverRole: {
        type: Sequelize.STRING,
      },
      driversId: {
        type: Sequelize.INTEGER,
        references: {
          model: "userprofiles", // Assurez-vous que c'est le nom correct de la table option
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      sentTime: {
        type: Sequelize.DATE,
      },
      sentTimeZone: {
        type: Sequelize.STRING,
      },
      reservationId: {
        type: Sequelize.INTEGER,
        references: {
          model: "reservations", // Assurez-vous que c'est le nom correct de la table option
          key: "reservationId",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      message: {
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
    await queryInterface.dropTable("Conversations");
  },
};
