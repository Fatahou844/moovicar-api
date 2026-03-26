"use strict";

/**
 * CRON JOB — Virements automatiques aux hôtes
 * ─────────────────────────────────────────────
 * Planification par défaut : tous les jours à 02h00
 *   cron.schedule("0 2 * * *", ...)
 *
 * Logique :
 *   1. Cherche tous les Paiements avec paiementStatus = "0" (En attente)
 *      dont la Reservation associée est "completed"
 *   2. Pour chaque paiement :
 *      a. Vérifie que l'hôte a un stripeAccountId
 *      b. Récupère le montant depuis le PaymentIntent Stripe
 *      c. Calcule le montant hôte : 80 % du montant encaissé
 *      d. Crée un stripe.transfers vers le compte Connect de l'hôte
 *      e. Met à jour Paiements.paiementStatus = "1", stocke transactionID & payoutId
 *   3. Retourne un rapport { success, failed, skipped }
 *
 * Commission : 20 % plateforme / 80 % hôte (configurable via PLATFORM_FEE_PERCENT)
 */

const cron    = require("node-cron");
const Stripe  = require("stripe");
const db      = require("../models/index");

const stripe         = new Stripe(process.env.STRIPE_SECRET_KEY);
const PLATFORM_FEE   = parseFloat(process.env.PLATFORM_FEE_PERCENT || "0.20"); // 20 %
const HOST_SHARE     = 1 - PLATFORM_FEE;

const Paiements   = db.Paiements;
const Reservation = db.Reservation;
const UserProfile = db.UserProfile;

/* ─────────────────────────────────────────────
   Fonction principale — exécutée par le cron
   et aussi exposée pour le déclenchement manuel
───────────────────────────────────────────── */
async function runPayoutBatch() {
  console.log(`[Payout Batch] Démarrage — ${new Date().toISOString()}`);

  const report = { success: 0, failed: 0, skipped: 0, details: [] };

  let pendingPaiements;
  try {
    pendingPaiements = await Paiements.findAll({
      where: { paiementStatus: "0" },
      include: [
        {
          model: Reservation,
          where: { status: "completed" },
          attributes: ["reservationId", "PaymentIntentId", "driverHoteId"],
          required: true,
        },
      ],
    });
  } catch (err) {
    console.error("[Payout Batch] Erreur requête DB :", err.message);
    return report;
  }

  console.log(`[Payout Batch] ${pendingPaiements.length} paiement(s) à traiter`);

  for (const paiement of pendingPaiements) {
    const resa   = paiement.Reservation;
    const resaId = resa?.reservationId ?? "?";

    try {
      /* ── 1. PaymentIntent requis ── */
      if (!resa?.PaymentIntentId) {
        console.warn(`[Payout Batch] ⚠️  Resa #${resaId} — PaymentIntentId manquant, ignoré`);
        report.skipped++;
        report.details.push({ resaId, status: "skipped", reason: "PaymentIntentId manquant" });
        continue;
      }

      /* ── 2. Récupérer l'hôte ── */
      const host = await UserProfile.findOne({
        where: { id: resa.driverHoteId },
        attributes: ["id", "email", "firstName", "lastName", "stripeAccountId"],
      });

      if (!host?.stripeAccountId) {
        console.warn(`[Payout Batch] ⚠️  Resa #${resaId} — hôte sans stripeAccountId, ignoré`);
        report.skipped++;
        report.details.push({ resaId, status: "skipped", reason: "Hôte sans stripeAccountId" });
        continue;
      }

      /* ── 3. Récupérer le montant Stripe ── */
      const paymentIntent = await stripe.paymentIntents.retrieve(resa.PaymentIntentId);

      if (paymentIntent.status !== "succeeded") {
        console.warn(`[Payout Batch] ⚠️  Resa #${resaId} — PaymentIntent status: ${paymentIntent.status}, ignoré`);
        report.skipped++;
        report.details.push({ resaId, status: "skipped", reason: `PI status: ${paymentIntent.status}` });
        continue;
      }

      const transferAmount = Math.floor(paymentIntent.amount_received * HOST_SHARE); // centimes

      /* ── 4. Créer le transfer Stripe → compte hôte ── */
      const transfer = await stripe.transfers.create({
        amount:      transferAmount,
        currency:    paymentIntent.currency,
        destination: host.stripeAccountId,
        description: `Moovicar — Location resa #${resaId} — hôte #${host.id}`,
        metadata: {
          reservationId:   String(resaId),
          paiementId:      String(paiement.id),
          paymentIntentId: resa.PaymentIntentId,
        },
      });

      /* ── 5. Mettre à jour le Paiement ── */
      await Paiements.update(
        {
          paiementStatus: "1",
          transactionID:  transfer.id,
          payoutId:       transfer.id,
        },
        { where: { id: paiement.id } }
      );

      const hostAmount = (transferAmount / 100).toLocaleString("fr-FR", {
        style: "currency", currency: paymentIntent.currency.toUpperCase(),
      });

      console.log(`[Payout Batch] ✅  Resa #${resaId} — Virement ${hostAmount} → ${host.email} (${transfer.id})`);
      report.success++;
      report.details.push({
        resaId,
        status:     "success",
        transferId: transfer.id,
        amount:     transferAmount / 100,
        currency:   paymentIntent.currency,
        host:       host.email,
      });

    } catch (err) {
      console.error(`[Payout Batch] ❌  Resa #${resaId} — Erreur : ${err.message}`);
      report.failed++;
      report.details.push({ resaId, status: "failed", reason: err.message });

      /* Marquer le paiement comme échoué en base */
      try {
        await Paiements.update(
          { paiementStatus: "2", notes: `Échec automatique : ${err.message}` },
          { where: { id: paiement.id } },
        );
      } catch (dbErr) {
        console.error(`[Payout Batch] ❌  Impossible de mettre à jour le statut en base pour resa #${resaId} :`, dbErr.message);
      }
    }
  }

  console.log(
    `[Payout Batch] Terminé — ✅ ${report.success} virés | ⚠️ ${report.skipped} ignorés | ❌ ${report.failed} échoués`
  );

  return report;
}

/* ─────────────────────────────────────────────
   Planification cron
   Modifier la planification via env PAYOUT_CRON_SCHEDULE
   Défaut : tous les jours à 02h00
───────────────────────────────────────────── */
const SCHEDULE = process.env.PAYOUT_CRON_SCHEDULE || "0 2 * * *";

cron.schedule(SCHEDULE, runPayoutBatch, {
  timezone: "Europe/Paris",
});

console.log(`[Payout Batch] Cron planifié : "${SCHEDULE}" (Europe/Paris)`);

module.exports = { runPayoutBatch };
