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

      Reservation.belongsTo(sequelize.models.InsurancePlan, {
        foreignKey: "insurancePlanId",
        as: "InsurancePlan",
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
        type: DataTypes.ENUM(
          // ─────────────
          // 1️⃣ DEMANDE
          // ─────────────
          "pending", // demande envoyée
          "accepted", // acceptée par propriétaire
          "rejected", // refusée
          "cancelled", // annulée avant paiement

          // ─────────────
          // 2️⃣ PAIEMENT
          // ─────────────
          "paid", // paiement validé
          "payment_failed", // paiement refusé

          // ─────────────
          // 3️⃣ CHECK-IN
          // ─────────────
          "checkin_pending_validation", // conducteur a soumis
          "checkin_refused", // refus propriétaire

          // ─────────────
          // 4️⃣ LOCATION ACTIVE
          // ─────────────
          "in_progress", // location démarrée
          "issue_reported", // problème signalé

          // ─────────────
          // 5️⃣ CHECK-OUT
          // ─────────────
          "completed_checkout", // retour soumis
          "checkout_refused", // refus retour

          // ─────────────
          // 6️⃣ FIN & LITIGE
          // ─────────────
          "completed", // retour validé
          "dispute_open", // litige ouvert
          "dispute_resolved", // litige clôturé

          // ─────────────
          // 7️⃣ CLÔTURE
          // ─────────────
          "closed", // transaction finalisée
          "refunded", // remboursement effectué
          "partially_refunded",
        ),
        defaultValue: "pending",
        allowNull: false,
      },
      PaymentIntentId: DataTypes.STRING,
      isPaidOut: { type: DataTypes.BOOLEAN, defaultValue: false },
      payoutId: DataTypes.STRING,
      // ── Distance supplémentaire ──
      distanceMaxKm:               { type: DataTypes.INTEGER, allowNull: true },
      distanceParcourueKm:         { type: DataTypes.INTEGER, allowNull: true },
      prixParKmSupp:               { type: DataTypes.FLOAT,   allowNull: true },
      extraDistancePaymentIntentId:{ type: DataTypes.STRING,  allowNull: true },
      extraDistancePaid:           { type: DataTypes.BOOLEAN, defaultValue: false },
      // ── Assurance ──
      insurancePlanId: { type: DataTypes.INTEGER, allowNull: true },
      insuranceFee:    { type: DataTypes.FLOAT,   allowNull: true },
    },
    {
      sequelize,
      modelName: "Reservation",
    },
  );
  return Reservation;
};
