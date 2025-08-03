const asuncHandler = require("express-async-handler");
const User = require("../models/user");
const { ApiError } = require("../middleware/errorHandler");
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
