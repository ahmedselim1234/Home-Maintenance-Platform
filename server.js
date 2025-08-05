
require("dotenv").config();
const express = require("express");
const db = require("./config/dbConnection");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
const { ApiError, HandleError } = require("./middleware/errorHandler");
// const {webhookCheckout}=require('./controllers/order')



const app = express();
const port = process.env.PORT || 4000;

// app.post(
//   "/webhook-checkout",
//   express.raw({ type: "application/json" }),
//   webhookCheckout
// );

// Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json({limit: "1kb"})); // Limit the size of JSON payloads
app.use(express.urlencoded({ limit: "1kb", extended: true })); // Limit the size of URL-encoded payloads
app.use(express.static(path.join(__dirname, "uploads")));



if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}


//mounting routes
const mountRouts = require('./routes/index');
mountRouts(app); 



//not found route||page 
app.use((req, res, next) => {
  next(new ApiError("this page is not exist", 404));
});

//global error handler
app.use(HandleError);

// any error not  from express
process.on("unhandledRejection", (err) => {
  console.log("unhandledRehection", err.message);
  process.exit(1);
});



db().then(() => {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
});
