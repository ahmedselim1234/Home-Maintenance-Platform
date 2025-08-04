const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "service is required"],
    },
    paymentMethodType: {
      type: String,
      default: "cash",
      enum: ["cash", "card"],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: Date,
    taxPrice: {
      type: Number,
      default: 0,
    },
    shippingAddress: {
      details: { type: String, required: true },
      phone: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    totalOrderPrice: {
      type: Number,
    },
    accepted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
