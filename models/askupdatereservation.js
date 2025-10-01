"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AskUpdateReservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AskUpdateReservation.belongsTo(sequelize.models.Reservation, {
        foreignKey: "reservationId",
      });
    }
  }
  AskUpdateReservation.init(
    {
      reservationId: DataTypes.INTEGER,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      motif: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "AskUpdateReservation",
    }
  );
  return AskUpdateReservation;
};
