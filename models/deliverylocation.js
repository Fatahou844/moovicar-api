"use strict";
const { Model, STRING } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DeliveryLocation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DeliveryLocation.belongsTo(sequelize.models.VehiculeAnnonce, {
        foreignKey: "annonceId",
      });
    }
  }
  DeliveryLocation.init(
    {
      addressEmplacementDelivery: DataTypes.STRING,
      annonceId: { type: DataTypes.INTEGER },
      customPlace: { type: DataTypes.STRING, allowNull: true },
      locationCoords: DataTypes.STRING,
      locationCoordsCustom: {
        type: DataTypes.STRING,
        allowNull: null,
      },
      deliveryCoords: DataTypes.STRING,
      deliveryAddressName: DataTypes.STRING,
      deliveryLocationActive: {
        type: DataTypes.ENUM("0", "1"),
        allowNull: true,
      },
      deliveryCosts: { type: DataTypes.FLOAT, defaultValue: 0 },
      PriseEnChargeMethod: {
        type: DataTypes.ENUM("0", "1", "2", "3"),
        defaultValue: "1",
      },
      MoreInfo: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: "DeliveryLocation",
    }
  );
  return DeliveryLocation;
};
