"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Notification.belongsTo(models.UserProfile, {
        foreignKey: "userId",
      });
    }
  }
  Notification.init(
    {
      userId: DataTypes.INTEGER,
      Titre: DataTypes.STRING,
      message: DataTypes.STRING,
      isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
      type: DataTypes.ENUM(
        "reservation_new", "reservation_accepted", "reservation_cancelled",
        "reservation_paid", "message_new", "payout", "system",
        "checkin_submitted", "checkin_validated", "checkin_refused",
        "checkout_submitted", "checkout_validated", "checkout_refused",
        "extra_charge"
      ),
      link: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Notification",
    }
  );
  return Notification;
};
