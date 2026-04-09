"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class InsurancePlan extends Model {
    static associate(models) {
      InsurancePlan.hasMany(models.Reservation, {
        foreignKey: "insurancePlanId",
        as: "Reservations",
      });
    }
  }

  InsurancePlan.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      // JSON array of coverage points, e.g. ["Dommages matériels jusqu'à 5 000 €", "Vol"]
      coverageDetails: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
          const raw = this.getDataValue("coverageDetails");
          try { return raw ? JSON.parse(raw) : []; } catch { return []; }
        },
        set(val) {
          this.setDataValue("coverageDetails", JSON.stringify(val));
        },
      },
      pricePerDay: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      maxCoverageAmount: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: "Montant maximum de couverture en €",
      },
      franchise: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
        comment: "Franchise à la charge du conducteur en €",
      },
      // "location" = assurance véhicule de location, "user" = protection du conducteur
      type: {
        type: DataTypes.ENUM("location", "user"),
        allowNull: false,
        defaultValue: "location",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      sortOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "InsurancePlan",
      tableName: "InsurancePlans",
    }
  );

  return InsurancePlan;
};
