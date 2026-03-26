const Brevo = require("@getbrevo/brevo");

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY,
);

const sendResetEmail = async (user, token) => {
  const verifyLink = `${process.env.LOCAL_CLIENT_APP}/reset-password/${token}`;

  const emailHtml = `
  <div style="font-family:Arial,sans-serif; background:#f4f6f8; padding:40px 20px;">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;padding:40px;text-align:center;">
      
      <h2 style="color:#1a1a1a;">Bienvenue ${user.firstName} 👋</h2>
      
      <p style="color:#555; font-size:16px;">
        Merci de rejoindre Moovicar.
      </p>

      <p style="color:#555; font-size:16px;">
        Pour réinitialiser votre compte, veuillez cliquer le lien suivant.
      </p>

      <a href="${verifyLink}" 
         style="display:inline-block;margin-top:20px;padding:14px 28px;
         background:#0066ff;color:white;text-decoration:none;
         border-radius:6px;font-weight:bold;">
         Réinitialiser mon compte
      </a>

      <p style="margin-top:30px;font-size:14px;color:#888;">
        Si le bouton ne fonctionne pas, copiez ce lien :
      </p>

      <p style="font-size:13px;color:#0066ff;word-break:break-all;">
        ${verifyLink}
      </p>

      <hr style="margin:30px 0;border:none;border-top:1px solid #eee;">

      <p style="font-size:12px;color:#999;">
        © ${new Date().getFullYear()} Moovicar. Tous droits réservés.
      </p>

    </div>
  </div>
  `;

  const response = await apiInstance.sendTransacEmail({
    sender: {
      name: "Moovicar",
      email: process.env.EMAIL_FROM,
    },
    to: [{ email: user.email, name: user.firstName }],
    subject: "Confirmez votre adresse email",
    htmlContent: emailHtml,
  });
};

module.exports = { sendResetEmail };
