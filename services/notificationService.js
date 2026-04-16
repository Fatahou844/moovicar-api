"use strict";

const db = require("../models/index");
const logger = require("../logger");
const { sendPushToUser } = require("../utils/sendPushToUser");

/**
 * Crée une notification en base, l'émet via socket et envoie un web push
 * si l'utilisateur n'est pas connecté.
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

    // ① Socket — temps réel si l'onglet est ouvert
    if (io) {
      io.to(`user_${userId}`).emit("notification", notif);
    }

    // ② Web Push — navigateur fermé ou app en arrière-plan
    await sendPushToUser(userId, { title: titre, body: message, link });

    return notif;
  } catch (err) {
    logger.error("Erreur création notification:", err);
  }
}

module.exports = { createNotification };
