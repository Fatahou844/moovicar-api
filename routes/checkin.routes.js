const router = require("express").Router();
const controller = require("../controllers/checkin.controller");

router.post("/:reservationId", controller.createCheckin);

router.put("/:reservationId/validate", controller.validateCheckin);

router.put("/:reservationId/refuse", controller.refuseCheckin);

router.get("/:reservationId", controller.getCheckin);
router.get("/", controller.getAllCheckins);

module.exports = router;
