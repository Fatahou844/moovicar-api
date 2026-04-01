"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Notifications", "isRead", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn("Notifications", "type", {
      type: Sequelize.ENUM(
        "reservation_new",
        "reservation_accepted",
        "reservation_cancelled",
        "reservation_paid",
        "message_new",
        "payout",
        "system",
      ),
      allowNull: true,
      defaultValue: "system",
    });
    await queryInterface.addColumn("Notifications", "link", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Notifications", "isRead");
    await queryInterface.removeColumn("Notifications", "type");
    await queryInterface.removeColumn("Notifications", "link");
  },
};
