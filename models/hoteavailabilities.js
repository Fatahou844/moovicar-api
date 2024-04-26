"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class HoteAvailabilities extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.HoteAvailabilities.belongsTo(models.UserProfile, {
        foreignKey: "userId",
      });
    }
  }
  HoteAvailabilities.init(
    {
      userId: DataTypes.INTEGER,
      alwaysAvailable: DataTypes.BOOLEAN,
      startTime: DataTypes.TIME,
      endTime: DataTypes.TIME,
      Weekday: DataTypes.ENUM("0", "1", "2", "3", "4", "5", "6"),
      ModeAvailability: DataTypes.ENUM("0", "1", "2"),
    },
    {
      sequelize,
      modelName: "HoteAvailabilities",
    }
  );
  return HoteAvailabilities;
};
