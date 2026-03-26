"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.Reservation, {
        foreignKey: "reservationId",
        as: "Reservation",
      });
      Transaction.belongsTo(models.UserProfile, {
        foreignKey: "hostId",
        as: "Host",
      });
    }
  }

  Transaction.init(
    {
      type: {
        type: DataTypes.ENUM("payout", "refund", "dispute_resolution"),
        allowNull: false,
      },
      reservationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      hostId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(3),
        defaultValue: "eur",
      },
      stripeTransferId: DataTypes.STRING,
      stripePayoutId: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM("pending", "paid", "failed"),
        defaultValue: "pending",
      },
      arrivalDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Transaction",
    },
  );

  return Transaction;
};
