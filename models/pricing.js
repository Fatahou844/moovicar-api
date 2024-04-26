"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pricing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Pricing.belongsTo(sequelize.models.Vehicle, {
        foreignKey: "vehiculeId",
      });
    }
  }
  Pricing.init(
    {
      PricingID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      vehiculeId: DataTypes.INTEGER,
      date: DataTypes.DATEONLY,
      price: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Pricing",
    }
  );
  return Pricing;
};
