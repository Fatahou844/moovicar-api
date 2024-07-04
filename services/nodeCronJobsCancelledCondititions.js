const cron = require("node-cron");
const db = require("../models/index");

const { Op } = require("sequelize");
const Reservation = db.Reservation;
const Vehicle = db.Vehicle;
const Unavailability = db.Unavailability;
const UserProfile = db.UserProfile;
const ReservationGains = db.ReservationGains;
const Paiements = db.Paiements;
const logger = require("../logger");

const checkAndAutoCancelReservations = async () => {
  try {
    const now = new Date();

    // Condition 1: Une demande acceptée par une hôte annule toutes les autres demandes de l’invité pour la même date de réservation.
    const acceptedReservations = await Reservation.findAll({
      where: {
        status: "1", // Statut "Confirmée et attente de paiement"
      },
    });

    for (let res of acceptedReservations) {
      await Reservation.update(
        { status: "2" }, // Statut "Annulé"
        {
          where: {
            driverInviteId: res.driverInviteId,
            startDate: res.startDate,
            endDate: res.endDate,
            status: {
              [Op.ne]: "1", // Sauf la réservation actuelle
            },
          },
        }
      );
    }

    // Condition 2: Une demande en attente de paiement est annulée si l’invité n’a pas effectué le paiement et qu’un autre invité réserve le véhicule et paye en premier.
    const pendingReservations = await Reservation.findAll({
      where: {
        status: "1", // Statut "Confirmée et attente de paiement"
      },
    });

    for (let res of pendingReservations) {
      const paidReservations = await Reservation.findAll({
        where: {
          vehiculeId: res.vehiculeId,
          status: "3", // Statut "Payé"
          startDate: {
            [Op.lte]: res.endDate,
          },
          endDate: {
            [Op.gte]: res.startDate,
          },
        },
      });

      if (paidReservations.length > 0) {
        res.status = "2"; // Statut "Annulé"
        await res.save();
      }
    }

    // Condition 3: Une réservation payée crée un intervalle d’indisponibilité daté.
    const paidReservations = await Reservation.findAll({
      where: {
        status: "3", // Statut "Payé"
      },
    });

    for (let res of paidReservations) {
      const existingUnavailability = await Unavailability.findOne({
        where: {
          vehiculeId: res.vehiculeId,
          start_date: res.startDate,
          end_date: res.endDate,
        },
      });

      if (!existingUnavailability) {
        await Unavailability.create({
          vehiculeId: res.vehiculeId,
          start_date: res.startDate,
          end_date: res.endDate,
          type: "1", // Type "réservation"
        });
      }
    }
    // Condition 4: Une demande en attente est annulée lorsqu’un autre invité effectue le paiement sur la même date d’intervalle.
    for (let res of pendingReservations) {
      const conflictingPaidReservations = await Reservation.findAll({
        where: {
          vehiculeId: res.vehiculeId,
          status: "3", // Statut "Payé"
          [Op.or]: [
            {
              startDate: {
                [Op.between]: [res.startDate, res.endDate],
              },
            },
            {
              endDate: {
                [Op.between]: [res.startDate, res.endDate],
              },
            },
          ],
        },
      });

      if (conflictingPaidReservations.length > 0) {
        res.status = "2"; // Statut "Annulé"
        await res.save();
      }
    }

    // Condition 5: Une demande en attente est annulée lorsqu’on la date de du voyage est arrivée et que le hôte n’a pas su répondre.
    const waitingReservations = await Reservation.findAll({
      where: {
        status: "0", // Statut "en attente"
        startDate: {
          [Op.lte]: now,
        },
      },
    });

    for (let res of waitingReservations) {
      res.status = "2"; // Statut "Annulé"
      await res.save();
    }

    // Nouvelle Condition: Passer les réservations payées (statut "3") en statut "4" (Complété) si la date de fin est terminée et qu'elles ne sont pas annulées.
    const reservationsToComplete = await Reservation.findAll({
      where: {
        status: "3", // Statut "Payé"
        endDate: {
          [Op.lte]: now,
        },
      },
    });

    for (let res of reservationsToComplete) {
      res.status = "4"; // Statut "Complété"
      await res.save();

      // Nouvelle Condition: Passer les réservations gains en attente (statut "0") en statut "3" (gagné) si la date de fin est terminée et qu'elles ne sont pas annulées.

      const reservationsGainToComplete = await ReservationGains.findAll({
        where: {
          type: "0", // Statut "en attente"
          reservationId: res.reservationId,
        },
      });

      for (let resGain of reservationsGainToComplete) {
        resGain.type = "3"; // Statut "Annulé"
        await resGain.save();

        // Initier un paiement pour la réservation
        try {
          const newPayment = await Paiements.create({
            reservationId: res.reservationId,
            amount: resGain.amount * 0.8,
            userId: res.driverHoteId,
            paiementStatus: "0",
            notes: "Gain gagné",
          });
          logger.info("Nouveau paiement ajouté:", newPayment);
        } catch (error) {
          logger.error("Erreur lors de l'ajout du paiement:", error);
        }
      }
    }
  } catch (error) {
    logger.error(
      "Erreur lors de l'annulation automatique des réservations:",
      error
    );
  }
};

// Planifier le cron job pour qu'il s'exécute toutes les minutes
cron.schedule("* * * * *", checkAndAutoCancelReservations, {
  scheduled: true,
  timezone: "Europe/Paris",
});
