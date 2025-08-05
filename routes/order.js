const express = require("express");
const orderController = require("../controllers/order");
const requireAuth = require("../middleware/isAuth");
const roles = require("../middleware/role");

const router = express.Router();

router.get(
  "/checkout-session/:serviceId",
  requireAuth,
  roles.allowedTo("user"),
  orderController.checkOutSession
);

router
  .route("/:serviceId")
  .post(
    requireAuth,
    roles.allowedTo("user"),
    orderController.createServiceCashOrOrder
  );
// for user  ---------------------
router
  .route("/userOrders")
  .get(
    requireAuth,
    roles.allowedTo("user"),
    orderController.getLoggedUserOrders
  );
router.delete(
  "/:id",
  requireAuth,
  roles.allowedTo("user"),
  orderController.deleteOrder
);
//----------------------------

// for technical user
router
  .route("/technicainOrders")
  .get(
    requireAuth,
    roles.allowedTo("technicain"),
    orderController.gettechnicalOrders
  );

router.put(
  "/:orderId/accept",
  requireAuth,
  roles.allowedTo("technicain"),
  orderController.acceptOrder
);
router.put(
  "/:orderId/complete",
  requireAuth,
  roles.allowedTo("technicain"),
  orderController.completeOrder
);
router.get(
  "/",
  requireAuth,
  roles.allowedTo("admin"),
  orderController.getAllOrders
);
//----------------
module.exports = router;
