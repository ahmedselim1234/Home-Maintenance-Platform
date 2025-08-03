const express = require("express");
const categoryController = require("../controllers/category");
const requireAuth = require("../middleware/isAuth");
const roles = require("../middleware/role");

// const {
//   getCategoryValidator,
//   createCategoryValidator,
//   updateCategoryValidator,
//   deleteCategoryValidator,
// } = require("../util/valedateCategory");

const router = express.Router();

// const subCategoryRoute = require("./subCategory");

// router.use("/:categoryId/subcategories", subCategoryRoute);

router
  .route("/")
  .post(
    requireAuth,
    roles.allowedTo("admin"),
    categoryController.uploadCategoryImage,
    categoryController.resizeImage,
    // createCategoryValidator,
    categoryController.createCategory
  )
  .get(categoryController.getCategories);

router
  .route("/:id")
  .get(
    // getCategoryValidator,
     categoryController.getSpeceficCategory)
  .put(
    requireAuth,
    roles.allowedTo("admin"),
    // categoryController.uploadCategoryImage,
    // categoryController.resizeImage,
    // updateCategoryValidator,
    categoryController.updateCategory
  )
  .delete(
    requireAuth,
    roles.allowedTo("admin"),
    // deleteCategoryValidator,
    categoryController.deleteCategory
  );

module.exports = router;
