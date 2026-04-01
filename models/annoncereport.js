"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AnnonceReport extends Model {
    static associate(models) {
      AnnonceReport.belongsTo(models.VehiculeAnnonce, { foreignKey: "annonceId" });
      AnnonceReport.belongsTo(models.UserProfile,     { foreignKey: "reporterId", as: "Reporter" });
    }
  }
  AnnonceReport.init(
    {
      annonceId:  DataTypes.INTEGER,
      reporterId: DataTypes.INTEGER,
      reason: DataTypes.ENUM(
        "contenu_inapproprie", "informations_fausses", "prix_abusif", "fraude", "autre"
      ),
      details:   DataTypes.TEXT,
      status:    { type: DataTypes.ENUM("pending", "reviewed", "dismissed", "actioned"), defaultValue: "pending" },
      adminNote: DataTypes.TEXT,
    },
    { sequelize, modelName: "AnnonceReport" }
  );
  return AnnonceReport;
};
