const asyncHandler = require("express-async-handler");
const factoryHandlers = require("./handlerFactory");
const Order = require("../models/order");
const Service = require("../models/service");

exports.createServiceOrOrder = asyncHandler(async (req, res, next) => {
  const { paymentMethodType, shippingAddress } = req.body;
  const serviceId = req.params.serviceId;
  const taxPrice = 0;

  const service = await Service.findById(serviceId);
  if (!service) {
    return next(new Error("Service not found"));
  }

  // Calculate total order price
  const totalOrderPrice = service.price + taxPrice;
  if (totalOrderPrice < 0) {
    return next(new Error("Total order price cannot be negative"));
  }

  // Create a new order
  const order = await Order.create({
    user: req.user.id,
    service: serviceId,
    totalOrderPrice,
    paymentMethodType,
    shippingAddress,
  });

  res.status(201).json({
    status: "success",
    data: {
      order,
    },
  });
});

// get logged user orders
exports.getLoggedUserOrders = asyncHandler(async (req, res, next) => {
  console.log(req.user.id);
  const orders = await Order.find({ user: req.user.id })
    .populate("service", "name price image technicain")
    .populate("user", "name email");

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: {
      orders,
    },
  });
});

// get technical user orders
exports.gettechnicalOrders = asyncHandler(async (req, res, next) => {
  const technicianId = req.user.id;

  const orders = await Order.find({}).populate({
    path: "service",
    match: { technicain: technicianId },
  });

  // إزالة الطلبات التي service=null
  const filteredOrders = orders.filter((order) => order.service !== null);

  if (filteredOrders.length === 0) {
    return next(new Error("No orders found for this technician"));
  }

  res.status(200).json({
    status: "success",
    results: filteredOrders.length,
    data: {
      orders: filteredOrders,
    },
  });
});

exports.acceptOrder = asyncHandler(async (req, res, next) => {
  const orderId = req.params.orderId;

  const order = await Order.findById(orderId);
  if (!order) {
    return next(new Error("Order not found"));
  }

  order.accepted = true;
  await order.save();

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

// complete order
exports.completeOrder = asyncHandler(async (req, res, next) => {
  const Id = req.params.orderId;

  const order = await Order.findById(Id);
  if (!order) {
    return next(new Error("Order not found"));
  } 
  if(order.accepted === false) {
    return next(new Error("Order must be accepted before completion"));
  }
    order.isCompleted = true;
    order.completedAt = Date.now();
    await order.save();

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});



// Delete order (commented out as per original code)
exports.deleteOrder = factoryHandlers.deleteFactoey(Order);
