"use strict";

const db = require("../models/index");
const logger = require("../logger");

/**
 * Crée une notification en base et l'émet via socket si disponible.
 * @param {object} opts
 * @param {number}  opts.userId   Destinataire
 * @param {string}  opts.titre    Titre court
 * @param {string}  opts.message  Message détaillé
 * @param {string}  [opts.type]   Type parmi l'enum Notification
 * @param {string}  [opts.link]   URL de redirection (optionnel)
 * @param {object}  [opts.io]     Instance socket.io (optionnel)
 */
async function createNotification({ userId, titre, message, type = "system", link, io }) {
  try {
    const notif = await db.Notification.create({
      userId,
      Titre: titre,
      message,
      type,
      link,
      isRead: false,
    });

    if (io) {
      io.to(`user_${userId}`).emit("notification", notif);
    }

    return notif;
  } catch (err) {
    logger.error("Erreur création notification:", err);
  }
}

module.exports = { createNotification };
