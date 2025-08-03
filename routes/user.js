const express = require("express");
const userController = require("../controllers/user");
const requireAuth = require("../middleware/isAuth");
const roles = require("../middleware/role");


const router = express.Router();

router.get("/getMe", requireAuth, roles.allowedTo('user'),userController.getLoggedUser);

module.exports = router;