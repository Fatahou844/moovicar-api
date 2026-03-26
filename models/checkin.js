"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Checkin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Checkin.belongsTo(sequelize.models.Reservation, {
        foreignKey: "reservationId",
      });
    }
  }
  Checkin.init(
    {
      reservationId: DataTypes.INTEGER,
      kmStart: DataTypes.INTEGER,
      fuelStart: DataTypes.STRING,
      signature: DataTypes.STRING,
      validatedBy: DataTypes.STRING,
      validatedAt: DataTypes.DATE,
      photos: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Checkin",
    },
  );
  return Checkin;
};
