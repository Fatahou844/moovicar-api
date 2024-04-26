const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Reservation.belongsTo(sequelize.models.Vehicle, {
        foreignKey: "vehiculeId",
      });

      Reservation.belongsTo(sequelize.models.VehiculeAnnonce, {
        foreignKey: "vehiculeAnnonceId",
      });

      Reservation.belongsTo(sequelize.models.UserProfile, {
        foreignKey: "driverHoteId",
        as: "Host",
      });

      Reservation.belongsTo(sequelize.models.UserProfile, {
        foreignKey: "driverInviteId",
        as: "Invite",
      });
    }
  }
  Reservation.init(
    {
      reservationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      driverHoteId: DataTypes.INTEGER,
      driverInviteId: DataTypes.INTEGER,
      vehiculeId: DataTypes.INTEGER,
      vehiculeAnnonceId: DataTypes.INTEGER,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      startEmplacement: DataTypes.STRING,
      endEmplacement: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM("0", "1", "2", "3", "4"),
        defaultValue: "0",
      },
      PaymentIntentId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Reservation",
    }
  );
  return Reservation;
};
