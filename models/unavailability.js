"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Unavailability extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // define association here
      Unavailability.belongsTo(sequelize.models.Vehicle, {
        foreignKey: "vehiculeId",
      });
    }
  }
  Unavailability.init(
    {
      UnavailabilityID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      vehiculeId: DataTypes.INTEGER,
      start_date: DataTypes.DATEONLY,
      end_date: DataTypes.DATEONLY,
      start_time: DataTypes.TIME,
      end_time: DataTypes.TIME,
      type: { type: DataTypes.ENUM("0", "1"), defaultValue: "1" },
      WeekDAY: DataTypes.ENUM("0", "1", "2", "3", "4", "5", "6"),
    },
    {
      sequelize,
      modelName: "Unavailability",
    }
  );
  return Unavailability;
};
