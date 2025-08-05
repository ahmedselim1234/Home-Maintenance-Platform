const express = require("express");
const userController = require("../controllers/user");
const requireAuth = require("../middleware/isAuth");
const roles = require("../middleware/role");

const router = express.Router();

router.get(
  "/getMe",
  requireAuth,
  roles.allowedTo("user"),
  userController.getLoggedUser
);
router.put(
  "/updateMe",
  requireAuth,
  roles.allowedTo("user"),
  userController.updateLoggedUser
);

//admin routes

router.use(requireAuth, roles.allowedTo("admin")); // Protect all admin routes

router.get("/", userController.getAllUsers);
router
  .route("/:id")
  .get(userController.getSpeceficUser)
  .delete(userController.deleteUser);

module.exports = router;
