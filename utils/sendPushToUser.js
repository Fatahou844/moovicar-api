"use strict";
/**
 * Utility — envoie une Web Push notification à tous les abonnements d'un user.
 * Le module `web-push` est un singleton Node : setVapidDetails est déjà appelé dans index.js.
 */
const webpush = require("web-push");
const db = require("../models");

/**
 * @param {number|string} userId
 * @param {{ title: string, body: string, link?: string, icon?: string }} payload
 * @param {object} [io]          — socket.io instance (optionnel)
 * @param {object} [userConnections] — map userId→socketId (optionnel)
 */
async function sendPushToUser(userId, payload, io, userConnections) {
  const PushSubscription = db.PushSubscription;

  // ① Socket temps réel si onglet ouvert
  if (io && userConnections) {
    const socketId = userConnections[String(userId)];
    if (socketId) io.to(socketId).emit("push-notification", payload);
  }

  // ② Web Push (navigateur en arrière-plan / fermé)
  const subs = await PushSubscription.findAll({ where: { userId } });
  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        JSON.parse(sub.subscription),
        JSON.stringify(payload)
      );
    } catch (e) {
      if (e.statusCode === 410 || e.statusCode === 404) await sub.destroy();
      else console.error("[sendPushToUser] web-push error:", e.message);
    }
  }
}

module.exports = { sendPushToUser };
