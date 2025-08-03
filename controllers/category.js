
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const factoryHandlers = require("./handlerFactory");
const Category = require("../models/serviceCategory");
const {uploadOneImage}=require("../middleware/uploadImage");



exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/category/${filename}`);

  //save in db
  req.body.image = filename;

  next();
});
 
exports.uploadCategoryImage =uploadOneImage('image')

exports.createCategory = factoryHandlers.createDocument(Category);

exports.getCategories = factoryHandlers.getALLDocument(Category,'Categories');

exports.getSpeceficCategory = factoryHandlers.getSpeceficDocument(Category);

exports.updateCategory = factoryHandlers.updateDocument(Category);

exports.deleteCategory = factoryHandlers.deleteFactoey(Category);
