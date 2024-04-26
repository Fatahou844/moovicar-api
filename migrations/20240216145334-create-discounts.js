"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Discounts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      DiscountID: {
        type: Sequelize.INTEGER,
      },
      vehiculeId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Vehicles", // Assurez-vous que c'est le nom correct de la table option
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      reservation_duration: {
        type: Sequelize.ENUM("0", "1", "2", "3", "4"),
      },
      pourcentage_reduction: {
        type: Sequelize.FLOAT,
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
    await queryInterface.dropTable("Discounts");
  },
};
