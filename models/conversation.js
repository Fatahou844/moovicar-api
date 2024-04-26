"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Conversation.belongsTo(sequelize.models.UserProfile, {
        foreignKey: "driversId",
      });

      Conversation.belongsTo(sequelize.models.Reservation, {
        foreignKey: "reservationId",
      });
    }
  }
  Conversation.init(
    {
      conversationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      allMediaRemoved: DataTypes.BOOLEAN,
      authorDriverRole: DataTypes.ENUM("0", "1"),
      driversId: DataTypes.INTEGER,
      sentTime: DataTypes.DATE,
      sentTimeZone: DataTypes.STRING,
      reservationId: DataTypes.INTEGER,
      message: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Conversation",
    }
  );
  return Conversation;
};
