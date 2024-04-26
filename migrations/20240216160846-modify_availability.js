"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("availabilities", "type", {
      type: Sequelize.ENUM("0", "1"), // Modifiez le type et la précision selon vos besoins
      allowNull: false,
      defaultValue: "0", // Assurez-vous que cette valeur correspond à celle actuellement définie dans votre modèle
    });
  },

  down: async (queryInterface, Sequelize) => {},
};
