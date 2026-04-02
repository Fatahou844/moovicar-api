const Brevo = require("@getbrevo/brevo");

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY,
);

/**
 * Email de confirmation de paiement — envoyé à l'invité après stripe.confirmPayment()
 */
const sendPaymentConfirmationEmail = async ({
  guest,
  host,
  reservation,
  amount,
  vehicle,
}) => {
  const resaLink = `https://app.moovicar.com/guest/reservation/${reservation.reservationId}`;

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const fmtEur = (n) =>
    (parseFloat(n) || 0).toLocaleString("fr-FR", {
      style: "currency",
      currency: "EUR",
    });

  const html = `
  <div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:40px 20px;">
    <div style="max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);">

      <!-- Header -->
      <div style="background:linear-gradient(135deg,#1d4ed8,#2563eb);padding:32px 40px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:22px;">✅ Paiement confirmé</h1>
        <p style="color:#bfdbfe;margin:8px 0 0;font-size:14px;">Réservation #${reservation.reservationId}</p>
      </div>

      <!-- Body -->
      <div style="padding:32px 40px;">
        <p style="color:#1a1a1a;font-size:16px;margin-top:0;">Bonjour <strong>${guest.firstName}</strong>,</p>
        <p style="color:#555;font-size:15px;">
          Votre paiement de <strong style="color:#16a34a;">${fmtEur(amount)}</strong> a bien été reçu.
          Votre location est maintenant confirmée.
        </p>

        <!-- Résumé réservation -->
        <div style="background:#f8fafc;border-radius:8px;padding:20px;margin:24px 0;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr>
              <td style="color:#6b7280;padding:6px 0;">Véhicule</td>
              <td style="color:#1a1a1a;font-weight:600;text-align:right;">${vehicle}</td>
            </tr>
            <tr>
              <td style="color:#6b7280;padding:6px 0;">Départ</td>
              <td style="color:#1a1a1a;text-align:right;">${fmtDate(reservation.startDate)}</td>
            </tr>
            <tr>
              <td style="color:#6b7280;padding:6px 0;">Retour</td>
              <td style="color:#1a1a1a;text-align:right;">${fmtDate(reservation.endDate)}</td>
            </tr>
            <tr>
              <td style="color:#6b7280;padding:6px 0;">Propriétaire</td>
              <td style="color:#1a1a1a;text-align:right;">${host.firstName} ${host.lastName}</td>
            </tr>
            <tr style="border-top:1px solid #e5e7eb;">
              <td style="color:#1a1a1a;font-weight:700;padding:10px 0 0;">Total payé</td>
              <td style="color:#16a34a;font-weight:700;font-size:16px;text-align:right;padding-top:10px;">${fmtEur(amount)}</td>
            </tr>
          </table>
        </div>

        <div style="text-align:center;margin:28px 0;">
          <a href="${resaLink}"
             style="display:inline-block;padding:14px 32px;background:#2563eb;color:#fff;
             text-decoration:none;border-radius:8px;font-weight:bold;font-size:15px;">
            Voir ma réservation
          </a>
        </div>

        <p style="color:#6b7280;font-size:13px;">
          Conservez ce mail comme reçu. Un récapitulatif est également disponible dans votre espace Moovicar.
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
        <p style="font-size:12px;color:#9ca3af;margin:0;">
          © ${new Date().getFullYear()} Moovicar · Tous droits réservés
        </p>
      </div>
    </div>
  </div>`;

  await apiInstance.sendTransacEmail({
    sender: { name: "Moovicar", email: process.env.EMAIL_FROM },
    to: [{ email: guest.email, name: guest.firstName }],
    subject: `✅ Paiement confirmé — Réservation #${reservation.reservationId}`,
    htmlContent: html,
  });
};

/**
 * Email de notification virement — envoyé à l'hôte quand le virement est effectué
 */
const sendPayoutNotificationEmail = async ({
  host,
  amount,
  transferId,
  reservation,
  vehicle,
}) => {
  const earningsLink = `https://moovicar.com/account/earnings`;

  const fmtEur = (n) =>
    (parseFloat(n) || 0).toLocaleString("fr-FR", {
      style: "currency",
      currency: "EUR",
    });

  const html = `
  <div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:40px 20px;">
    <div style="max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);">

      <div style="background:linear-gradient(135deg,#15803d,#16a34a);padding:32px 40px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:22px;">💸 Virement reçu</h1>
        <p style="color:#bbf7d0;margin:8px 0 0;font-size:14px;">Réservation #${reservation.reservationId}</p>
      </div>

      <div style="padding:32px 40px;">
        <p style="color:#1a1a1a;font-size:16px;margin-top:0;">Bonjour <strong>${host.firstName}</strong>,</p>
        <p style="color:#555;font-size:15px;">
          Un virement de <strong style="color:#16a34a;">${fmtEur(amount)}</strong> a été effectué
          sur votre compte Stripe Connect pour la location de <strong>${vehicle}</strong>.
        </p>

        <div style="background:#f0fdf4;border-radius:8px;padding:20px;margin:24px 0;border:1px solid #bbf7d0;">
          <p style="margin:0 0 8px;font-size:13px;color:#6b7280;">Référence virement</p>
          <p style="margin:0;font-family:monospace;font-size:13px;color:#15803d;">${transferId}</p>
        </div>

        <p style="color:#6b7280;font-size:13px;">
          Le virement peut prendre 1 à 3 jours ouvrés pour apparaître sur votre IBAN.
        </p>

        <div style="text-align:center;margin:28px 0;">
          <a href="${earningsLink}"
             style="display:inline-block;padding:14px 32px;background:#16a34a;color:#fff;
             text-decoration:none;border-radius:8px;font-weight:bold;font-size:15px;">
            Voir mes revenus
          </a>
        </div>
      </div>

      <div style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
        <p style="font-size:12px;color:#9ca3af;margin:0;">© ${new Date().getFullYear()} Moovicar</p>
      </div>
    </div>
  </div>`;

  await apiInstance.sendTransacEmail({
    sender: { name: "Moovicar", email: process.env.EMAIL_FROM },
    to: [{ email: host.email, name: host.firstName }],
    subject: `💸 Virement de ${fmtEur(amount)} — Réservation #${reservation.reservationId}`,
    htmlContent: html,
  });
};

module.exports = { sendPaymentConfirmationEmail, sendPayoutNotificationEmail };
