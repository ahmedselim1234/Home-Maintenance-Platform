const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const db =asyncHandler( async () => {
  await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");
});

module.exports=db;