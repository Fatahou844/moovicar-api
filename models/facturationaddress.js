"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FacturationAddress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.FacturationAddress.belongsTo(models.UserProfile, {
        foreignKey: "userId",
      });
    }
  }
  FacturationAddress.init(
    {
      facturationAddressId: DataTypes.INTEGER,
      adresse: DataTypes.STRING,
      postalCode: DataTypes.STRING,
      ville: DataTypes.STRING,
      pays: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "FacturationAddress",
    }
  );
  return FacturationAddress;
};
