"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class VehiculeAnnonce extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      VehiculeAnnonce.belongsTo(sequelize.models.Vehicle, {
        foreignKey: "vehiculeId",
      });
    }
  }
  VehiculeAnnonce.init(
    {
      vehiculeAnnonceId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      reservationPrice: DataTypes.DECIMAL,
      locationMode: DataTypes.ENUM("0", "1"),
      vehiculeType: DataTypes.STRING,
      vehiculeId: DataTypes.INTEGER,
      minDistanceInclus: DataTypes.DECIMAL,
      additionalDriverInclus: DataTypes.ENUM("0", "1"),
      annulationAnnonceDelayBefore: DataTypes.ENUM("0", "1"),
      carburantInclus: DataTypes.ENUM("0", "1"),
      supplementJeuneDriver: DataTypes.ENUM("0", "1"),
      distanceOutMin: DataTypes.DECIMAL,
      locationAddress: DataTypes.STRING,
      locationCoordinates: DataTypes.STRING,
      status: DataTypes.ENUM("0", "1", "2", "3"),
    },
    {
      sequelize,
      modelName: "VehiculeAnnonce",
    }
  );
  return VehiculeAnnonce;
};
