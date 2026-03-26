"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.ENUM("payout", "refund", "dispute_resolution"),
        allowNull: false,
      },
      reservationId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "Reservations", key: "reservationId" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      hostId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "UserProfiles", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING(3),
        defaultValue: "eur",
      },
      stripeTransferId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      stripePayoutId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("pending", "paid", "failed"),
        defaultValue: "pending",
      },
      arrivalDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Transactions");
  },
};
