"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ReviewVehicle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Définissez les relations avec les modèles associés
      ReviewVehicle.belongsTo(sequelize.models.UserProfile, {
        foreignKey: "userId",
      });
      ReviewVehicle.belongsTo(sequelize.models.Vehicle, {
        foreignKey: "vehiculeId",
      });
    }
  }
  ReviewVehicle.init(
    {
      reviewVehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      content: DataTypes.TEXT,
      rating: DataTypes.DECIMAL,
      userId: DataTypes.INTEGER,
      vehiculeId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ReviewVehicle",
    }
  );
  return ReviewVehicle;
};
