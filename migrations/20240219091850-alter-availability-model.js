"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("availabilities", "DateCustomise", {
      type: Sequelize.DATEONLY,
      allowNull: true, // ou false, selon vos besoins
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("availabilities", "DateCustomise");
  },
};
