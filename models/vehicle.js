"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Vehicle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Vehicle.belongsTo(models.VehicleModel, {
        foreignKey: "modeleId",
      });
      models.Vehicle.belongsTo(models.UserProfile, { foreignKey: "userId" });

      models.Vehicle.hasOne(models.VehiculeAnnonce, {
        foreignKey: "vehiculeAnnonceId",
      });
    }
  }
  Vehicle.init(
    {
      vehiculeId: DataTypes.INTEGER,
      description: DataTypes.STRING(2048),
      images: DataTypes.STRING(2048),
      principalPhotos: DataTypes.STRING(2048),
      lateralPhotos: DataTypes.STRING(2048),
      interiorPhotos: DataTypes.STRING(2048),
      SupplementPhotos: DataTypes.STRING(2048),
      CoordonatesCity: DataTypes.TEXT,
      modeleId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      kilometrage: DataTypes.ENUM("0", "1", "2", "3", "4"),
      carburantType: DataTypes.ENUM("0", "1", "2", "3", "4", "5"),
      vitesseType: DataTypes.ENUM("0", "1"),
      porteNumber: DataTypes.ENUM("0", "1", "2", "3", "4"),
      siegeNumber: DataTypes.ENUM("0", "1", "2", "3", "4", "5", "6"),
      annee: DataTypes.ENUM(
        "2024",
        "2023",
        "2022",
        "2021",
        "2020",
        "2019",
        "2018",
        "2017",
        "1016",
        "2015",
        "2014",
        "2013",
        "2012",
        "2011",
        "2010"
      ),
    },
    {
      sequelize,
      modelName: "Vehicle",
    }
  );
  return Vehicle;
};
