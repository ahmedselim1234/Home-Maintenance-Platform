class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4) ? "fail" : "error";
    this.isOperational = true;
  }
}

const HandleError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "err";
  
  if (process.env.NODE_ENV === "development") {
    HandleErrorInDev(err, res);
  } else {
    HandleErrorInProd(err, res);
  }
};

const HandleErrorInDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    
    error: err,
    stack: err.stack,
  });
};

const HandleErrorInProd = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = { ApiError, HandleError };
 