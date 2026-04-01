"use strict";

/**
 * Calcule le montant remboursable selon la politique d'annulation et le délai.
 *
 * Politiques :
 *  - flexible  : remboursement 100% si > 24h avant, 50% sinon
 *  - moderate  : remboursement 100% si > 5 jours avant, 50% si 1–5 jours, 0% sinon
 *  - strict    : remboursement 100% si > 14 jours avant, 0% sinon
 *
 * @param {string} policy   "flexible" | "moderate" | "strict"
 * @param {Date}   startDate Date de début de la réservation
 * @param {number} totalPaid Montant total payé en centimes
 * @returns {{ refundAmount: number, percentage: number, reason: string }}
 */
function computeRefund(policy, startDate, totalPaid) {
  const now = new Date();
  const hoursUntilStart = (new Date(startDate).getTime() - now.getTime()) / (1000 * 3600);
  const daysUntilStart = hoursUntilStart / 24;

  let percentage = 0;
  let reason = "";

  if (policy === "flexible") {
    if (hoursUntilStart >= 24) {
      percentage = 100;
      reason = "Annulation flexible — plus de 24h avant le début";
    } else {
      percentage = 50;
      reason = "Annulation flexible — moins de 24h avant le début (50%)";
    }
  } else if (policy === "moderate") {
    if (daysUntilStart >= 5) {
      percentage = 100;
      reason = "Annulation modérée — plus de 5 jours avant le début";
    } else if (daysUntilStart >= 1) {
      percentage = 50;
      reason = "Annulation modérée — entre 1 et 5 jours avant le début (50%)";
    } else {
      percentage = 0;
      reason = "Annulation modérée — moins de 24h avant le début (non remboursable)";
    }
  } else if (policy === "strict") {
    if (daysUntilStart >= 14) {
      percentage = 100;
      reason = "Annulation stricte — plus de 14 jours avant le début";
    } else {
      percentage = 0;
      reason = "Annulation stricte — moins de 14 jours avant le début (non remboursable)";
    }
  }

  const refundAmount = Math.round((totalPaid * percentage) / 100);
  return { refundAmount, percentage, reason };
}

module.exports = { computeRefund };
