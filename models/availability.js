"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Availability extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Availability.belongsTo(sequelize.models.Vehicle, {
        foreignKey: "vehiculeId",
      });
    }
  }
  Availability.init(
    {
      AvailabilityID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      vehiculeId: DataTypes.INTEGER,
      WeekDAY: DataTypes.ENUM("0", "1", "2", "3", "4", "5", "6"),
      fromTime: DataTypes.TIME,
      untilTime: DataTypes.TIME,
      Type_de_location: DataTypes.ENUM("0", "1"),
      Default_price: DataTypes.FLOAT,
      type: DataTypes.ENUM("0", "1"),
      DateCustomise: DataTypes.DATEONLY,
    },
    {
      sequelize,
      modelName: "Availability",
    }
  );
  return Availability;
};
