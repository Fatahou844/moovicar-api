const Brevo = require("@getbrevo/brevo");

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY,
);

const sendIdentityDocumentsReminder = async (user) => {
  const profileLink = `https://moovicar.com/guest/settings`;

  const emailHtml = `
  <div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:40px 20px;">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;padding:40px;text-align:center;">
      
      <h2 style="color:#1a1a1a;">Action requise sur votre compte</h2>
      
      <p style="color:#555;font-size:16px;">
        Bonjour ${user.firstName},
      </p>

      <p style="color:#555;font-size:16px;">
        Pour garantir la sécurité et la confiance sur Moovicar, nous avons besoin que vous complétiez les documents suivants :
      </p>

      <ul style="text-align:left;color:#555;font-size:16px;line-height:1.6;">
        <li>Permis de conduire</li>
        <li>Pièce d’identité</li>
      </ul>

      <p style="color:#555;font-size:16px;">
        Sans ces documents, certaines fonctionnalités peuvent être limitées.
      </p>

      <a href="${profileLink}" 
         style="display:inline-block;margin-top:20px;padding:14px 28px;
         background:#0066ff;color:white;text-decoration:none;
         border-radius:6px;font-weight:bold;">
         Compléter mes documents
      </a>

      <p style="margin-top:30px;font-size:14px;color:#888;">
        Merci de votre coopération.
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
    subject: "Documents requis pour activer votre compte",
    htmlContent: emailHtml,
  });
};

module.exports = { sendIdentityDocumentsReminder };
