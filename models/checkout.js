"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Checkout extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Checkout.belongsTo(sequelize.models.Reservation, {
        foreignKey: "reservationId",
      });
    }
  }
  Checkout.init(
    {
      reservationId: DataTypes.INTEGER,
      kmEnd: DataTypes.INTEGER,
      fuelEnd: DataTypes.STRING,
      comment: DataTypes.TEXT,
      validatedAt: DataTypes.DATE,
      photos: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Checkout",
    },
  );
  return Checkout;
};
