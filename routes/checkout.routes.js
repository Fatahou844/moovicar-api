const router = require("express").Router();
const controller = require("../controllers/checkout.controller");

router.post("/:reservationId", controller.createCheckout);

router.put("/:reservationId/validate", controller.validateCheckout);
router.put("/:reservationId/refuse", controller.refuseCheckout);
router.post("/:reservationId/retry-extra-charge", controller.retryExtraCharge);
router.get("/:reservationId/extra-distance-preview", controller.previewExtraDistance);
router.get("/:reservationId", controller.getCheckout);
router.get("/", controller.getAllCheckouts);

module.exports = router;
