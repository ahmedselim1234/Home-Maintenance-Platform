const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    slug: {
    type: String,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "technicain"],
      default: "user",
    },
    phone: {
      type: String,
    },
    profileImage: String,
    active: {
      type: Boolean,
      default: true,
    },
    dateOfChangePassword: {
      type: Date,
    },
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
      },
    ],
    passwordResetCode: String,
    expireResetCode: Date,
    verifyResetCode: Boolean,
  },
  { timestamps: true }
);

userSchema.pre('save',async function (next) {
    if(!this.isModified('password'))return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})


module.exports = mongoose.model("User", userSchema); 
