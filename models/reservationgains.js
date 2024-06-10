"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ReservationGains extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ReservationGains.belongsTo(sequelize.models.Reservation, {
        foreignKey: "reservationId",
      });
    }
  }
  ReservationGains.init(
    {
      reservationId: DataTypes.INTEGER,
      amount: DataTypes.STRING,
      type: DataTypes.ENUM("0", "1", "2", "3"),
    },
    {
      sequelize,
      modelName: "ReservationGains",
    }
  );
  return ReservationGains;
};
