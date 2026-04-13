"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    static associate(models) {
      Favorite.belongsTo(models.UserProfile, { foreignKey: "userId", as: "User" });
      Favorite.belongsTo(models.VehiculeAnnonce, {
        foreignKey: "vehiculeAnnonceId",
        as: "Annonce",
      });
    }
  }

  Favorite.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId:           { type: DataTypes.INTEGER, allowNull: false },
      vehiculeAnnonceId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Favorite",
      tableName: "Favorites",
      indexes: [{ unique: true, fields: ["userId", "vehiculeAnnonceId"] }],
    }
  );

  return Favorite;
};
