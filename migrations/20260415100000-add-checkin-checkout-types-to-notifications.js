"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Notifications", "type", {
      type: Sequelize.ENUM(
        "reservation_new", "reservation_accepted", "reservation_cancelled",
        "reservation_paid", "message_new", "payout", "system",
        "checkin_submitted", "checkin_validated", "checkin_refused",
        "checkout_submitted", "checkout_validated", "checkout_refused",
        "extra_charge"
      ),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Notifications", "type", {
      type: Sequelize.ENUM(
        "reservation_new", "reservation_accepted", "reservation_cancelled",
        "reservation_paid", "message_new", "payout", "system"
      ),
      allowNull: true,
    });
  },
};
