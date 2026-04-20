"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CustomAvailabilities", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "UserProfiles", key: "id" },
        onDelete: "CASCADE",
      },
      specificDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      startTime: {
        type: Sequelize.TIME,
        allowNull: false,
        defaultValue: "00:00:00",
      },
      endTime: {
        type: Sequelize.TIME,
        allowNull: false,
        defaultValue: "23:59:00",
      },
      label: {
        type: Sequelize.STRING(120),
        allowNull: true,
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.addIndex("CustomAvailabilities", ["userId", "specificDate"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("CustomAvailabilities");
  },
};
