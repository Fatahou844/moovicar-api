const nodeCron = require("node-cron");
const db = require("../models/index");

// Importer les modèles Sequelize
const Reservation = db.Reservation;
const UserProfile = db.UserProfile;

// Définir la fonction de mise à jour des performances de l'hôte
async function updatePerformancesHotes() {
  try {
    // Récupérer tous les utilisateurs hôtes
    const hotes = await UserProfile.findAll();

    // Parcourir chaque hôte pour mettre à jour ses performances
    for (const hote of hotes) {
      // Récupérer l'ID de l'utilisateur hôte
      const driverHoteId = hote.id;

      // Récupérer les réservations avec les statuts spécifiés pour cet hôte
      const paidReservations = await Reservation.count({
        where: {
          driverHoteId,
          status: ["3", "1", "4"],
        },
      });

      const TotalReservations = await Reservation.count({
        where: {
          driverHoteId,
        },
      });

      const completedReservations = await Reservation.count({
        where: { driverHoteId, status: "4" },
      });

      // Calculer le taux d'acceptation
      const acceptanceRate = (paidReservations / TotalReservations) * 100;

      // Mettre à jour le nombre de voyages finalisés
      const finalizedTrips = completedReservations;

      // Mettre à jour les performances de l'hôte dans UserProfile
      await UserProfile.update(
        {
          AcceptanceRate: acceptanceRate.toFixed(2),
          Finalizedtrips: finalizedTrips.toFixed(2),
        },
        { where: { id: driverHoteId } }
      );

      console.log(
        `Performances de l'hôte ${driverHoteId} mises à jour avec succès.`
      );
    }
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour des performances des hôtes:",
      error
    );
  }
}

// Exporter la fonction et le cron job
function startCronJob() {
  nodeCron.schedule("*/1 * * * *", updatePerformancesHotes);
}

// Planifier l'exécution périodique de la fonction de mise à jour des performances des hôtes
module.exports = startCronJob;
