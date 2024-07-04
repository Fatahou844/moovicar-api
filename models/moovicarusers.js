"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MoovicarUsers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MoovicarUsers.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      level: DataTypes.ENUM("0", "1", "2"),
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "MoovicarUsers",
    }
  );
  return MoovicarUsers;
};
