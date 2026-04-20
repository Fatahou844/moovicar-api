"use strict";

const nodeCron = require("node-cron");
const { Op }   = require("sequelize");
const db       = require("../models/index");
const logger   = require("../logger");

const UserProfile    = db.UserProfile;
const Reservation    = db.Reservation;
const ReviewVehicle  = db.ReviewVehicle;

/**
 * Calcule et met à jour pour chaque hôte :
 *  - AcceptanceRate   : % de demandes acceptées (accepted + paid + in_progress + completed)
 *  - Finalizedtrips   : locations terminées (status = completed)
 *  - EvaluationNumber : nombre total d'avis reçus
 *  - AcceptanceRate   : moyenne des notes (sur 5) — stockée dans le champ existant
 *
 * Tourne chaque jour à 03:00
 */
async function evaluateHotes() {
  logger.info("[CronEval] Démarrage évaluation périodique des hôtes");

  try {
    const hotes = await UserProfile.findAll({ attributes: ["id"] });

    for (const hote of hotes) {
      const id = hote.id;

      const [
        totalDemandes,
        demandesAcceptees,
        tripsCompleted,
        reviews,
      ] = await Promise.all([
        Reservation.count({ where: { driverHoteId: id } }),
        Reservation.count({
          where: {
            driverHoteId: id,
            status: { [Op.in]: ["accepted", "paid", "in_progress", "completed", "closed"] },
          },
        }),
        Reservation.count({ where: { driverHoteId: id, status: "completed" } }),
        ReviewVehicle.findAll({
          include: [{
            model: db.Vehicle,
            attributes: [],
            where: { UserProfileId: id },
            required: true,
          }],
          attributes: ["rating"],
        }),
      ]);

      const acceptanceRate = totalDemandes > 0
        ? parseFloat(((demandesAcceptees / totalDemandes) * 100).toFixed(2))
        : 0;

      const avgRating = reviews.length > 0
        ? parseFloat((reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(2))
        : null;

      await UserProfile.update(
        {
          AcceptanceRate:   acceptanceRate,
          Finalizedtrips:   tripsCompleted,
          EvaluationNumber: reviews.length,
          ...(avgRating !== null && { EngagementRate: avgRating }), // réutilise EngagementRate pour la note moyenne
        },
        { where: { id } },
      );
    }

    logger.info(`[CronEval] ${hotes.length} hôte(s) évalués avec succès`);
  } catch (err) {
    logger.error("[CronEval] Erreur évaluation hôtes :", err.message);
  }
}

function startEvaluationCron() {
  // Tous les jours à 03h00
  nodeCron.schedule("0 3 * * *", evaluateHotes, { timezone: "Europe/Paris" });
  logger.info("[CronEval] Cron évaluation hôtes planifié — tous les jours à 03:00");
}

module.exports = { startEvaluationCron, evaluateHotes };
