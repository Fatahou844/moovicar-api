const { Op } = require("sequelize");
const db = require("../models/index");
const userprofile = db.UserProfile;

const { hashPassword } = require("../utils/password");
const { generateToken, addMinutes } = require("../utils/tokens");
const logger = require("../logger");
const { sendResetEmail } = require("../utils/sendResetEmail");

// POST /api/auth/reset-password?token=xxxxx
// body: { password }

/**
 * POST /api/auth/forgot-password
 * body: { email }
 */
async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email requis" });
    }

    const user = await userprofile.findOne({ where: { email } });

    // réponse neutre (sécurité)
    if (!user) {
      return res.json({
        message:
          "Si cet email existe, un lien de réinitialisation a été envoyé.",
      });
    }

    const token = generateToken(32);
    const expires = addMinutes(new Date(), 30); // 30 minutes

    await userprofile.update(
      {
        password_reset_token: token,
        password_reset_expires: expires,
      },
      { where: { id: user.id } },
    );

    // 🔥 Envoi email ici
    // const resetLink = `${FRONT_URL}/reset-account?token=${token}`;
    await sendResetEmail(user, token);

    logger.info("Password reset token generated for: " + email);

    return res.json({
      message: "Si cet email existe, un lien de réinitialisation a été envoyé.",
    });
  } catch (err) {
    logger.error("Error requestPasswordReset: ", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
async function resetPassword(req, res) {
  try {
    const token = req.query.token; // comme ton verify
    const { password } = req.body;

    if (!token) return res.status(400).json({ message: "Token requis" });
    if (!password)
      return res.status(400).json({ message: "Mot de passe requis" });
    if (password.length < 8) {
      return res.status(400).json({ message: "Minimum 8 caractères" });
    }

    const user = await userprofile.findOne({
      where: {
        password_reset_token: token,
        password_reset_expires: { [Op.gt]: new Date() }, // pas expiré
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Lien invalide ou expiré" });
    }

    const hashed = await hashPassword(password);

    await userprofile.update(
      {
        password: hashed,
        password_reset_token: null,
        password_reset_expires: null,
      },
      { where: { id: user.id } },
    );

    logger.info("Password reset success for user: " + user.email);

    return res.json({ message: "Mot de passe réinitialisé" });
  } catch (err) {
    logger.error("Error resetPassword: ", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

module.exports = { requestPasswordReset, resetPassword };
