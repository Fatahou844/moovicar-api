const Brevo = require("@getbrevo/brevo");

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY,
);

const sendReservationAcceptedEmail = async (user, reservation) => {
  const reservationLink = `${process.env.LOCAL_CLIENT_APP}/guest/reservation/${reservation.reservationId}`;

  const emailHtml = `
  <div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:40px 20px;">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;padding:40px;text-align:center;">
      
      <h2 style="color:#1a1a1a;">Bonne nouvelle ${user.firstName} 🎉</h2>
      
      <p style="color:#555;font-size:16px;">
        Votre demande de réservation <strong>#${reservation.reservationId}</strong> a été acceptée.
      </p>

      <p style="color:#555;font-size:16px;">
        Vous pouvez maintenant consulter les détails et contacter l’hôte si nécessaire.
      </p>

      <a href="${reservationLink}" 
         style="display:inline-block;margin-top:20px;padding:14px 28px;
         background:#28a745;color:white;text-decoration:none;
         border-radius:6px;font-weight:bold;">
         Voir ma réservation
      </a>

      <p style="margin-top:30px;font-size:14px;color:#888;">
        Si le bouton ne fonctionne pas, copiez ce lien :
      </p>

      <p style="font-size:13px;color:#28a745;word-break:break-all;">
        ${reservationLink}
      </p>

      <hr style="margin:30px 0;border:none;border-top:1px solid #eee;">

      <p style="font-size:12px;color:#999;">
        Merci de faire confiance à Moovicar.
      </p>

      <p style="font-size:12px;color:#999;">
        © ${new Date().getFullYear()} Moovicar. Tous droits réservés.
      </p>

    </div>
  </div>
  `;

  await apiInstance.sendTransacEmail({
    sender: {
      name: "Moovicar",
      email: process.env.EMAIL_FROM,
    },
    to: [{ email: user.email, name: user.firstName }],
    subject: `Votre réservation #${reservation.reservationId} est acceptée`,
    htmlContent: emailHtml,
  });
};

module.exports = { sendReservationAcceptedEmail };
