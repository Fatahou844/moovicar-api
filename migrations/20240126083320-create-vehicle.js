"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Vehicles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      vehiculeId: {
        type: Sequelize.INTEGER,
      },
      description: {
        type: Sequelize.STRING(2048),
      },
      images: {
        type: Sequelize.STRING(2048),
      },
      CoordonatesCity: {
        type: Sequelize.TEXT,
      },
      modeleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "vehiclemodels", // Assurez-vous que c'est le nom correct de la table modèle
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "userprofiles", // Assurez-vous que c'est le nom correct de la table modèle
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      kilometrage: {
        type: Sequelize.ENUM("0", "1", "2", "3", "4"),
      },
      carburantType: {
        type: Sequelize.ENUM("0", "1", "2", "3", "4", "5"),
      },
      vitesseType: {
        type: Sequelize.ENUM("0", "1"),
      },
      porteNumber: {
        type: Sequelize.ENUM("0", "1", "2", "3", "4"),
      },
      siegeNumber: {
        type: Sequelize.ENUM("0", "1", "2", "3", "4", "5", "6"),
      },
      annee: {
        type: Sequelize.ENUM(
          "2024",
          "2023",
          "2022",
          "2021",
          "2020",
          "2019",
          "2018",
          "2017",
          "1016",
          "2015",
          "2014",
          "2013",
          "2012",
          "2011",
          "2010"
        ),
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
    await queryInterface.dropTable("Vehicles");
  },
};
