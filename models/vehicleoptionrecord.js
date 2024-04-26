"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class VehicleOptionRecord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Définissez les relations avec les modèles associés
      VehicleOptionRecord.belongsTo(sequelize.models.VehicleOption, {
        foreignKey: "vehiculeOptionId",
      });
      VehicleOptionRecord.belongsTo(sequelize.models.Vehicle, {
        foreignKey: "vehiculeId",
      });

      // Synchronisez le modèle avec la base de données
      VehicleOptionRecord.sync({ force: false }); // Mettez à true si vous voulez recréer la table à chaque fois
    }
  }
  VehicleOptionRecord.init(
    {
      vehicleOptionRecordId: DataTypes.INTEGER,
      vehiculeOptionId: DataTypes.INTEGER,
      vehiculeId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "VehicleOptionRecord",
    }
  );
  return VehicleOptionRecord;
};
