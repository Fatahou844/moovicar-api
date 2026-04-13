"use strict";
const db = require("../models");
const Favorite        = db.Favorite;
const VehiculeAnnonce = db.VehiculeAnnonce;
const Vehicle         = db.Vehicle;
const VehicleModel    = db.VehicleModel;
const UserProfile     = db.UserProfile;

/* Toggle — ajoute si absent, retire si présent */
exports.toggle = async (req, res) => {
  try {
    const { userId, vehiculeAnnonceId } = req.body;
    if (!userId || !vehiculeAnnonceId)
      return res.status(400).json({ message: "userId et vehiculeAnnonceId requis" });

    const existing = await Favorite.findOne({ where: { userId, vehiculeAnnonceId } });

    if (existing) {
      await existing.destroy();
      return res.json({ favorited: false });
    }

    await Favorite.create({ userId, vehiculeAnnonceId });
    return res.json({ favorited: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Liste des favoris d'un utilisateur avec données annonce */
exports.listByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const favorites = await Favorite.findAll({
      where: { userId },
      include: [
        {
          model: VehiculeAnnonce,
          as: "Annonce",
          attributes: [
            "vehiculeAnnonceId",
            "reservationPrice",
            "locationMode",
            "vehiculeType",
            "distanceOutMin",
            "locationAddress",
            "status",
          ],
          include: [
            {
              model: Vehicle,
              attributes: ["id", "principalPhotos", "images", "description"],
              include: [
                {
                  model: VehicleModel,
                  attributes: ["id", "marque", "modele"],
                },
                {
                  model: UserProfile,
                  attributes: ["id", "firstName", "lastName", "profile_url", "city"],
                },
              ],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Vérifie si une annonce est dans les favoris d'un user */
exports.check = async (req, res) => {
  try {
    const { userId, vehiculeAnnonceId } = req.params;
    const fav = await Favorite.findOne({ where: { userId, vehiculeAnnonceId } });
    res.json({ favorited: !!fav });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
