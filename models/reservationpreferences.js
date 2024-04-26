const { Model } = require("sequelize"); // Import DataTypes along with Model
module.exports = (sequelize, DataTypes) => {
  class ReservationPreferences extends Model {
    static associate(models) {
      ReservationPreferences.belongsTo(sequelize.models.Vehicle, {
        foreignKey: "vehiculeId",
      });
    }
  }
  ReservationPreferences.init(
    {
      vehiculeId: DataTypes.INTEGER,
      reservationsInstantanne: DataTypes.ENUM("0", "1"),
      home_preavis: DataTypes.ENUM("0", "1", "2", "3", "4", "5", "6"),
      home_minDureeVoyage: DataTypes.ENUM("0", "1", "2", "3", "4"),
      home_maxDureeVoyage: DataTypes.ENUM("0", "1", "2", "3", "4", "5"),
      locationDelivery_preavis: DataTypes.ENUM(
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6"
      ),
      locationDelivery_minDureeVoyage: DataTypes.ENUM("0", "1", "2", "3", "4"),
      locationDelivery_maxDureeVoyage: DataTypes.ENUM(
        "0",
        "1",
        "2",
        "3",
        "4",
        "5"
      ),
      LocationDelivereyPeriodTempo: DataTypes.ENUM(
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9"
      ),
      HomePeriodTempo: DataTypes.ENUM(
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9"
      ),
    },
    {
      sequelize,
      modelName: "ReservationPreferences",
    }
  );
  return ReservationPreferences;
};
