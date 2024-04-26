"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Discounts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Discounts.belongsTo(sequelize.models.Vehicle, {
        foreignKey: "vehiculeId",
      });
    }
  }
  Discounts.init(
    {
      DiscountID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      vehiculeId: DataTypes.INTEGER,
      reservation_duration: DataTypes.ENUM("0", "1", "2", "3", "4"),
      pourcentage_reduction: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Discounts",
    }
  );
  return Discounts;
};
