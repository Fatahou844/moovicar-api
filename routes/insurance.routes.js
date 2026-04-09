const router = require("express").Router();
const ctrl   = require("../controllers/insurance.controller");

/* Public */
router.get("/plans",              ctrl.listPlans);
router.get("/plans/:slug",        ctrl.getPlanBySlug);

/* Guest — associer un plan à une réservation */
router.post("/reservations/:reservationId/select", ctrl.selectPlanForReservation);

/* Admin — gestion du catalogue */
router.post("/plans",             ctrl.createPlan);
router.put("/plans/:id",          ctrl.updatePlan);
router.delete("/plans/:id",       ctrl.deletePlan);

module.exports = router;
