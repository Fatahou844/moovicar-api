"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("PushSubscriptions", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: Sequelize.INTEGER, allowNull: false },
      endpoint: { type: Sequelize.STRING(512), allowNull: false, unique: true },
      subscription: { type: Sequelize.TEXT, allowNull: false }, // JSON string
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex("PushSubscriptions", ["userId"]);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("PushSubscriptions");
  },
};
