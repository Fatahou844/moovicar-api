"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PushSubscription extends Model {}
  PushSubscription.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      endpoint: { type: DataTypes.STRING(512), allowNull: false, unique: true },
      subscription: { type: DataTypes.TEXT, allowNull: false }, // JSON
    },
    { sequelize, modelName: "PushSubscription" }
  );
  return PushSubscription;
};
