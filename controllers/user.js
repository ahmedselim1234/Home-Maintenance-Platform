const asuncHandler = require("express-async-handler");
const User = require("../models/user");
const { ApiError } = require("../middleware/errorHandler");
const factoryHandlers = require("./handlerFactory");
const slugify = require("slugify");

// const bcrypt = require("bcryptjs");

//get logges user data
exports.getLoggedUser = asuncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select(
    "-password -slug -role -active -addresses -passwordResetCode -expireResetCode -verifyResetCode -dateOfChangePassword "
  );
  console.log(user);

  if (!user) {
    throw new ApiError("User not found", 404);
  }
  res.status(200).json({
    success: true,
    user,
  });
});

//user
exports.updateLoggedUser = asuncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      slug: slugify(req.body.name),
      email: req.body.email,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
      addresses: req.body.addresses,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    user,
  });
});

//Admin
exports.getAllUsers = asuncHandler(async (req, res) => {
  const users = await User.find()
  console.log(users);

  if (!users) {
    throw new ApiError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    results: users.length,
    users,
  });
});

//admin
exports.deleteUser = factoryHandlers.deleteFactoey(User);

exports.getSpeceficUser = factoryHandlers.getSpeceficDocument(User);