"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class VehiclePhoto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      VehiclePhoto.belongsTo(sequelize.models.Reservation, {
        foreignKey: "reservationId",
      });
    }
  }
  VehiclePhoto.init(
    {
      reservationId: DataTypes.INTEGER,
      type: DataTypes.ENUM("checkin", "checkout"),
      url: DataTypes.STRING,
      category: DataTypes.ENUM("exterior", "interior", "dashboard", "fuel"),
    },
    {
      sequelize,
      modelName: "VehiclePhoto",
    },
  );
  return VehiclePhoto;
};
