"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Availabilities", {
      AvailabilityID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
      WeekDAY: {
        type: Sequelize.ENUM("0", "1", "2", "3", "4", "5", "6"),
      },
      fromTime: {
        type: Sequelize.TIME,
      },
      untilTime: {
        type: Sequelize.TIME,
      },
      Type_de_location: {
        type: Sequelize.ENUM("0", "1"),
      },
      Default_price: {
        type: Sequelize.FLOAT,
      },
      type: {
        type: Sequelize.ENUM("0", "1"),
      },
      DateCustomise: {
        type: Sequelize.DATEONLY,
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
    await queryInterface.dropTable("Availabilities");
  },
};
