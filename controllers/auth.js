const { ApiError } = require("../middleware/errorHandler");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const generateToken = require("./generateToken");
const slugify = require("slugify");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Tokens = require('csrf');
const tokens = new Tokens();

exports.signUp = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.json({ massege: "fill all fields" });

  const user = await User.findOne({ email });
  if (user) {
    return next(new ApiError("this document is not exist", 404));
  }

  req.body.slug = slugify(req.body.name);
  console.log(req.body.slug);

  const newUser = await User.create(req.body);

  const accessToken = generateToken.accessToken(newUser);
  const refreshToken = generateToken.refreshToken(newUser);
   // Generate CSRF secret & token
  const csrfSecret = tokens.secretSync();
  const csrfToken = tokens.create(csrfSecret);

  const id =newUser._id;
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: 'Strict'
  });

    res.cookie("csrf_secret", csrfSecret, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  });

  // Send CSRF token to frontend in a readable cookie
  res.cookie("csrf_token", csrfToken, {
    httpOnly: false,
    secure: true,
    sameSite: 'Strict',
  });

  res.json({ accessToken, email,id });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return res.json({ massege: "fill all fields" });

  const user = await User.findOne({ email });
  const passIsTrue = await bcrypt.compare(password, user.password);

  if (!user || !passIsTrue) {
    return next(new ApiError("incorrect password or email", 404));
  }

  const accessToken = generateToken.accessToken(user);
  const refreshToken = generateToken.refreshToken(user);

   // Generate CSRF secret & token
  const csrfSecret = tokens.secretSync();
  const csrfToken = tokens.create(csrfSecret);

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: 'Strict'
  });

    res.cookie("csrf_secret", csrfSecret, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  });

  // Send CSRF token to frontend in a readable cookie
  res.cookie("csrf_token", csrfToken, {
    httpOnly: false,
    secure: true,
    sameSite: 'Strict',
  });

  res.json({ accessToken, user});
});

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  // check user with this email is exist or not
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("this email nit exist ", 404));
  }
  // send reset code after hash it
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedCode = await crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = hashedCode;
  user.expireResetCode = Date.now() + 1000 * 60 * 10;
  user.verifyResetCode = false;

  await user.save();

  try {
    await sendEmail({
      email: user.email,
      subject: "your reset code ",
      message: `hi ${user.name} \n your reset code is \n ${resetCode} `,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.expireResetCode = undefined;
    user.verifyResetCode = undefined;
    await user.save();
    return res.json({ m: "error when sending email" });
  }

  res.status(200).json({ message: "code send succesfully" });
});

exports.verifyCode = asyncHandler(async (req, res, next) => {
  const { enteredCode } = req.body;

  const hashedCode = await crypto
    .createHash("sha256")
    .update(enteredCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedCode,
    expireResetCode: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("invalid or expired code ", 404));
  }

  user.verifyResetCode = true;
  await user.save();

  res.status(200).json({ message: "code verified successfully" });
});

exports.addNewPassword = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("this email nit exist ", 404));
  }

  user.password = password;
  console.log(password);
  user.passwordResetCode = undefined;
  user.expireResetCode = undefined;
  user.verifyResetCode = undefined;
  await user.save();

  res.status(200).json({ m: "password changed successfully" });
});

exports.refresh = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new ApiError("un authenticated", 401));
  }

  jwt.verify(token, process.env.REFREESH_TOKEN_SECRET, async (err, decode) => {
    if (err) {
      return next(new ApiError("forbidden", 403));
    }

    const user = await User.findById(decode.userInfo.id);
    console.log(user);
    const accessToken = generateToken.accessToken(user);

    res.json({ accessToken });
  });
});

exports.logout = asyncHandler(async (req, res, next) => {
  res.clearCookie("jwt", {
    HttpOnly: true,
    sameSite: "none",
  });
  res.json({ message: "logged out" });
});

