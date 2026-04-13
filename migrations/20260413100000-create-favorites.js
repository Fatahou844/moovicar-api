"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Favorites", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "UserProfiles", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      vehiculeAnnonceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "VehiculeAnnonces", key: "vehiculeAnnonceId" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
    await queryInterface.addIndex("Favorites", ["userId", "vehiculeAnnonceId"], {
      unique: true,
      name: "favorites_user_annonce_unique",
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("Favorites");
  },
};
