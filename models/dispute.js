"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Dispute extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Dispute.belongsTo(sequelize.models.Reservation, {
        foreignKey: "reservationId",
      });
    }
  }
  Dispute.init(
    {
      reservationId: DataTypes.INTEGER,
      reportedBy: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      status: {
        type: DataTypes.ENUM("open", "under_review", "resolved", "rejected"),
        defaultValue: "open",
      },
      resolution: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Dispute",
    },
  );
  return Dispute;
};
