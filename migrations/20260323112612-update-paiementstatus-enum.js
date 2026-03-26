"use strict";

/**
 * Migration : étend l'ENUM paiementStatus de ("0","1","2") à ("0","1","2","3","4")
 *   0 = En attente
 *   1 = Validé (virement hôte effectué)
 *   2 = Annulé
 *   3 = Litige ouvert
 *   4 = Remboursé
 *
 * MySQL : il faut modifier directement la colonne ENUM.
 * PostgreSQL : il faut ajouter les nouvelles valeurs via ALTER TYPE.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const dialect = queryInterface.sequelize.getDialect();

    if (dialect === "mysql" || dialect === "mariadb") {
      await queryInterface.changeColumn("Paiements", "paiementStatus", {
        type: Sequelize.ENUM("0", "1", "2", "3", "4"),
        allowNull: true,
        defaultValue: "0",
      });
    } else if (dialect === "postgres") {
      // PostgreSQL ne supporte pas CHANGE COLUMN sur ENUM directement
      // On ajoute les valeurs manquantes au type existant
      await queryInterface.sequelize.query(
        `ALTER TYPE "enum_Paiements_paiementStatus" ADD VALUE IF NOT EXISTS '3';`
      );
      await queryInterface.sequelize.query(
        `ALTER TYPE "enum_Paiements_paiementStatus" ADD VALUE IF NOT EXISTS '4';`
      );
    } else {
      // SQLite : recréer la colonne
      await queryInterface.changeColumn("Paiements", "paiementStatus", {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "0",
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const dialect = queryInterface.sequelize.getDialect();

    if (dialect === "mysql" || dialect === "mariadb") {
      // Repasse à l'ENUM d'origine (attention : les lignes avec "3" ou "4" deviendront NULL)
      await queryInterface.changeColumn("Paiements", "paiementStatus", {
        type: Sequelize.ENUM("0", "1", "2"),
        allowNull: true,
        defaultValue: "0",
      });
    }
    // PostgreSQL : impossible de supprimer une valeur d'un type ENUM sans recréer le type
    // SQLite : rien à faire (la colonne reste STRING)
  },
};
