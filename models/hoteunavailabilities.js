"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class HoteUnavailabilities extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.HoteUnavailabilities.belongsTo(models.UserProfile, {
        foreignKey: "userId",
      });
    }
  }
  HoteUnavailabilities.init(
    {
      userId: DataTypes.INTEGER,
      startDate: DataTypes.DATEONLY,
      endDate: DataTypes.DATEONLY,
      startTime: DataTypes.TIME,
      endTime: DataTypes.TIME,
    },
    {
      sequelize,
      modelName: "HoteUnavailabilities",
    }
  );
  return HoteUnavailabilities;
};
