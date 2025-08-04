const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const { ApiError } = require("../middleware/errorHandler");
const { ApiFeatures } = require("../utils/apiFeatures");

exports.deleteFactoey = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    const model = await Model.findById(id);
    if (!model) {
      return next(new ApiError("this document is not exist", 404));
    }
       await model.deleteOne()
    res.status(204).json({ mesaage: "document is deleted" });
  });

exports.updateDocument = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    } 

    const model = await Model.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    if (!model) {
      return next(new ApiError("this document is not exist", 404));
    }
    model.save();
    res.status(200).json({ data: model });
  });

exports.createDocument = (Model) =>
  asyncHandler(async (req, res, next) => {
    if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    } 
    const newModel = await Model.create(req.body);

    res.status(201).json({ newModel });
  });

exports.getSpeceficDocument = (Model, populateOptions) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let query;

    if (req.params.productId) {
      const prodId = req.params.productId;

      query = Model.findOne({ _id: id, product: prodId });
    } else {
      query = Model.findOne({ _id: id });
    }
    
    if (populateOptions) {
      query.populate(populateOptions);
    }
    
    const model = await query;
    // console.log(model)

    if (!model) {
      return next(new ApiError("This document does not exist", 404));
    }

    res.status(200).json({ data: model });
  });

exports.getALLDocument = (Model, ModelName) =>
  asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.filterObject) {
      filter = req.filterObject;
    }
    const CountOfDocuments = await Model.countDocuments();

    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .search(ModelName)
      .sort()
      .limitFields()
      .paginate(CountOfDocuments);

    const { mongoQuery, paginatetionResult } = apiFeatures;

    const Documents = await mongoQuery;

    res.status(200).json({
      result: Documents.length,
      paginatetionResult: paginatetionResult,
      data: Documents,
    });
  });
