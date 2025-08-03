const express = require("express");
const serviceController = require("../controllers/service");
const requireAuth = require("../middleware/isAuth");
const roles = require("../middleware/role");

// const {
//   getCategoryValidator,
//   createCategoryValidator,
//   updateCategoryValidator,
//   deleteCategoryValidator,
// } = require("../util/valedateCategory");

const router = express.Router();

router 
  .route("/")
  .post(
    requireAuth,
    roles.allowedTo("technicain"),
    serviceController.uploadServiceImage,
    serviceController.resizeImage,
    // createCategoryValidator,
    serviceController.createService
  )
  .get(serviceController.getServices);

router
  .route("/:id")
  .get(
    // getCategoryValidator,
    serviceController.getSpeceficService
  )
  .put(
    requireAuth,
    roles.allowedTo("technicain"),
    // categoryController.uploadCategoryImage,
    // categoryController.resizeImage,
    // updateCategoryValidator,
    serviceController.updateService
  )
  .delete(
    requireAuth,
    roles.allowedTo("technicain"),
    // deleteCategoryValidator,
    serviceController.deleteService
  );

module.exports = router;
