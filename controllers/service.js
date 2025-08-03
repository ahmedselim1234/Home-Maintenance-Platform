
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const factoryHandlers = require("./handlerFactory");
const Service = require("../models/service");
const {uploadOneImage}=require("../middleware/uploadImage");



exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `service-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/service/${filename}`);

  //save in db
  req.body.image = filename;

  next();
});
 
exports.uploadServiceImage =uploadOneImage('image')

exports.createService= factoryHandlers.createDocument(Service);

exports.getServices = factoryHandlers.getALLDocument(Service,'services');

exports.getSpeceficService = factoryHandlers.getSpeceficDocument(Service);

exports.updateService = factoryHandlers.updateDocument(Service);

exports.deleteService = factoryHandlers.deleteFactoey(Service);
