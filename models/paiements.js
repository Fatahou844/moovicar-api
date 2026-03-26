"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Paiements extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Paiements.belongsTo(sequelize.models.Reservation, {
        foreignKey: "reservationId",
      });

      Paiements.belongsTo(models.UserProfile, {
        foreignKey: "userId",
      });
    }
  }
  Paiements.init(
    {
      reservationId: DataTypes.INTEGER,
      amount: DataTypes.FLOAT,
      userId: DataTypes.INTEGER,
      paiementData: DataTypes.DATE,
      paiementStatus: DataTypes.ENUM("0", "1", "2", "3", "4"),
      paiement_method: DataTypes.ENUM("card", "bank", "paypal"),
      transactionID: DataTypes.STRING,
      notes: DataTypes.STRING,
      TransactionDate: DataTypes.DATE,
      paymentIntentId: DataTypes.STRING,
      payoutId: DataTypes.STRING,
      refundId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Paiements",
    }
  );
  return Paiements;
};
