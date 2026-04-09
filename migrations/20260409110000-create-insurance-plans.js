"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("InsurancePlans", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      coverageDetails: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: "JSON array of coverage bullet points",
      },
      pricePerDay: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      maxCoverageAmount: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      franchise: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0,
      },
      type: {
        type: Sequelize.ENUM("location", "user"),
        allowNull: false,
        defaultValue: "location",
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      sortOrder: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Seed default plans
    await queryInterface.bulkInsert("InsurancePlans", [
      {
        name: "Basique",
        slug: "basic",
        description: "Couverture essentielle incluse dans la location.",
        coverageDetails: JSON.stringify([
          "Responsabilité civile obligatoire",
          "Assistance en cas de panne",
          "Franchise élevée : 1 500 €",
        ]),
        pricePerDay: 0,
        maxCoverageAmount: 5000,
        franchise: 1500,
        type: "location",
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Confort",
        slug: "comfort",
        description: "Protection renforcée pour rouler l'esprit tranquille.",
        coverageDetails: JSON.stringify([
          "Responsabilité civile obligatoire",
          "Dommages matériels jusqu'à 10 000 €",
          "Vol du véhicule",
          "Assistance 24h/24",
          "Franchise réduite : 500 €",
        ]),
        pricePerDay: 4.99,
        maxCoverageAmount: 10000,
        franchise: 500,
        type: "location",
        isActive: true,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Premium",
        slug: "premium",
        description: "La protection maximale, zéro franchise.",
        coverageDetails: JSON.stringify([
          "Tout risque — dommages tous accidents",
          "Vol, incendie, catastrophes naturelles",
          "Protection du conducteur et des passagers",
          "Véhicule de remplacement inclus",
          "Zéro franchise",
        ]),
        pricePerDay: 9.99,
        maxCoverageAmount: 30000,
        franchise: 0,
        type: "location",
        isActive: true,
        sortOrder: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("InsurancePlans");
  },
};
