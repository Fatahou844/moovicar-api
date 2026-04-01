"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AnnonceReports", {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      annonceId:   { type: Sequelize.INTEGER, allowNull: false },
      reporterId:  { type: Sequelize.INTEGER, allowNull: false }, // userId qui signale
      reason: {
        type: Sequelize.ENUM(
          "contenu_inapproprie",
          "informations_fausses",
          "prix_abusif",
          "fraude",
          "autre",
        ),
        allowNull: false,
      },
      details:  { type: Sequelize.TEXT, allowNull: true },
      status: {
        type: Sequelize.ENUM("pending", "reviewed", "dismissed", "actioned"),
        allowNull: false,
        defaultValue: "pending",
      },
      adminNote: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("AnnonceReports");
  },
};
