"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // ⚠️ Supprimer ancien ENUM (si existant)
    await queryInterface.sequelize
      .query(
        'ALTER TABLE "Reservations" DROP CONSTRAINT IF EXISTS "Reservations_status_check";',
      )
      .catch(() => {});

    // Mettre à jour la colonne avec les nouveaux statuts
    await queryInterface.changeColumn("Reservations", "status", {
      type: Sequelize.ENUM(
        // 1️⃣ DEMANDE
        "pending",
        "accepted",
        "rejected",
        "cancelled",

        // 2️⃣ PAIEMENT
        "paid",
        "payment_failed",

        // 3️⃣ CHECK-IN
        "checkin_pending_validation",
        "checkin_refused",

        // 4️⃣ LOCATION ACTIVE
        "in_progress",
        "issue_reported",

        // 5️⃣ CHECK-OUT
        "completed_checkout",
        "checkout_refused",

        // 6️⃣ FIN & LITIGE
        "completed",
        "dispute_open",
        "dispute_resolved",

        // 7️⃣ CLÔTURE
        "closed",
        "refunded",
      ),
      allowNull: false,
      defaultValue: "pending",
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // rollback vers ancien ENUM si besoin
    await queryInterface.changeColumn("Reservations", "status", {
      type: Sequelize.ENUM("0", "1", "2", "3", "4"),
      allowNull: false,
      defaultValue: "0",
    });
  },
};
