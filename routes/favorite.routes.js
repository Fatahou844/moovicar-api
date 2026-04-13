const router = require("express").Router();
const ctrl   = require("../controllers/favorite.controller");

router.post("/toggle",                           ctrl.toggle);
router.get("/user/:userId",                      ctrl.listByUser);
router.get("/check/:userId/:vehiculeAnnonceId",  ctrl.check);

module.exports = router;
