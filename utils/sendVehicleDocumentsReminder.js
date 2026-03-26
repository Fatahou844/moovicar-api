const Brevo = require("@getbrevo/brevo");

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY,
);

const sendVehicleDocumentsReminder = async (user) => {
  const profileLink = `${process.env.LOCAL_CLIENT_APP}/account/voitures`;

  const emailHtml = `
  <div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:40px 20px;">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;padding:40px;text-align:center;">
      
      <h2 style="color:#1a1a1a;">Documents du véhicule requis</h2>
      
      <p style="color:#555;font-size:16px;">
        Bonjour ${user.firstName},
      </p>

      <p style="color:#555;font-size:16px;">
        Afin de garantir la conformité et la sécurité des locations, merci de fournir les documents suivants :
      </p>

      <ul style="text-align:left;color:#555;font-size:16px;line-height:1.6;">
        <li>Attestation d’assurance valide</li>
        <li>Document d’immatriculation</li>
        <li>Dernier contrôle technique</li>
      </ul>

      <p style="color:#555;font-size:16px;">
        Ces documents sont obligatoires pour maintenir votre véhicule disponible à la location.
      </p>

      <a href="${profileLink}" 
         style="display:inline-block;margin-top:20px;padding:14px 28px;
         background:#0066ff;color:white;text-decoration:none;
         border-radius:6px;font-weight:bold;">
         Ajouter mes documents
      </a>

      <p style="margin-top:30px;font-size:14px;color:#888;">
        Merci pour votre collaboration et votre réactivité.
      </p>

      <hr style="margin:30px 0;border:none;border-top:1px solid #eee;">

      <p style="font-size:12px;color:#999;">
        Service de modération Moovicar
      </p>

      <p style="font-size:12px;color:#999;">
        © ${new Date().getFullYear()} Moovicar
      </p>

    </div>
  </div>
  `;

  await apiInstance.sendTransacEmail({
    sender: {
      name: "Modération Moovicar",
      email: process.env.EMAIL_FROM,
    },
    to: [{ email: user.email, name: user.firstName }],
    subject: "Documents véhicule requis",
    htmlContent: emailHtml,
  });
};

module.exports = { sendVehicleDocumentsReminder };
