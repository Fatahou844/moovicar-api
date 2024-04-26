"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ReservationCarPreferences extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ReservationCarPreferences.belongsTo(sequelize.models.Vehicle, {
        foreignKey: "vehiculeId",
      });
    }
  }
  ReservationCarPreferences.init(
    {
      vehiculeId: DataTypes.INTEGER,
      reservationsInstantanne: DataTypes.BOOLEAN,
      home_preavis: DataTypes.ENUM("0", "1", "2", "3", "4", "5", "6"),
      home_minDureeVoyage: DataTypes.ENUM("0", "1", "2", "3", "4"),
      home_maxDureeVoyage: DataTypes.ENUM("0", "1", "2", "3", "4", "5"),
      locationDelivery_preavis: DataTypes.ENUM(
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6"
      ),
      locationDelivery_minDureeVoyage: DataTypes.ENUM("0", "1", "2", "3", "4"),
      locationDelivery_maxDureeVoyage: DataTypes.ENUM(
        "0",
        "1",
        "2",
        "3",
        "4",
        "5"
      ),
      locationDeliveryPeriodTempo: DataTypes.ENUM(
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9"
      ),
      HomePeriodTempo: DataTypes.ENUM(
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9"
      ),
    },
    {
      sequelize,
      modelName: "ReservationCarPreferences",
    }
  );
  return ReservationCarPreferences;
};
