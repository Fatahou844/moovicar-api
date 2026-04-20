"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CustomAvailability extends Model {
    static associate(models) {
      CustomAvailability.belongsTo(models.UserProfile, { foreignKey: "userId" });
    }
  }

  CustomAvailability.init(
    {
      userId:       { type: DataTypes.INTEGER,      allowNull: false },
      specificDate: { type: DataTypes.DATEONLY,     allowNull: false },
      startTime:    { type: DataTypes.TIME,         allowNull: false, defaultValue: "00:00:00" },
      endTime:      { type: DataTypes.TIME,         allowNull: false, defaultValue: "23:59:00" },
      label:        { type: DataTypes.STRING(120),  allowNull: true },
    },
    { sequelize, modelName: "CustomAvailability" }
  );

  return CustomAvailability;
};
