const asyncHandler = require("express-async-handler");
const factoryHandlers = require("./handlerFactory");
const Order = require("../models/order");
const { ApiError } = require("../middleware/errorHandler");
const User = require("../models/user");
const Service = require("../models/service");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.createServiceCashOrOrder = asyncHandler(async (req, res, next) => {
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
  if (order.accepted === false) {
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

// admin
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find()
    .populate("service", "name price image technicain")
    .populate("user", "name email");

  if (!orders || orders.length === 0) {
    return next(new Error("No orders found"));
  }

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: {
      orders,
    },
  });
});

// Delete order (commented out as per original code)
exports.deleteOrder = factoryHandlers.deleteFactoey(Order);

// Checkout session
exports.checkOutSession = asyncHandler(async (req, res, next) => {
  console.log("create session")
  const taxPrice = 0;

  //get order
  const service = await Service.findById(req.params.serviceId);
  if (!service) return next(new ApiError("this order is not exist", 400));

  const totalOrderPrice = taxPrice + service.price;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: Math.round(totalOrderPrice * 100),
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/v1/orders/userOrders`,
    cancel_url: `${req.protocol}://${req.get("host")}/v1/services/${
      req.params.serviceId
    }`,
    customer_email: req.user.email,
    client_reference_id: String(service._id),
    metadata: req.body.shippingAddress,
  });

  res.status(200).json({ session });
});

// exports.checkOutSession = asyncHandler(async (req, res, next) => {
//   console.log("🔥 createSession called");

//   const taxPrice = 0;
//   const service = await Service.findById(req.params.serviceId);
//   if (!service) {
//     console.log("❌ Service not found");
//     return next(new ApiError("this order is not exist", 400));
//   }

//   const totalOrderPrice = taxPrice + service.price;
//   console.log("📦 service:", service.name, "💰 price:", totalOrderPrice);

//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         price_data: {
//           currency: "egp",
//           unit_amount: Math.round(totalOrderPrice * 100),
//           product_data: {
//             name: req.user.name,
//           },
//         },
//         quantity: 1,
//       },
//     ],
//     mode: "payment",
//     success_url: `${req.protocol}://${req.get("host")}/v1/orders/userOrders`,
//     cancel_url: `${req.protocol}://${req.get("host")}/v1/services/${req.params.serviceId}`,
//     customer_email: req.user.email,
//     client_reference_id: String(service._id),
//     metadata: req.body.shippingAddress,
//   });

//   console.log("✅ Stripe session created:", session.id);

//   res.status(200).json({ session });
// });


//create order

const createOrder = async (session) => {
  const serviceId = session.client_reference_id;

  const shippingAddress = {
    city: session.metadata?.city,
    details: session.metadata?.details,
    phone: session.metadata?.phone,
    postalCode: session.metadata?.postalCode,
  };

  const orderPrice = session.amount_total / 100;

  const email = session.customer_details.email;

  if (!email) throw new Error("Missing customer email");

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const order = await Order.create({
    user: user._id,
    totalOrderPrice: orderPrice,
    shippingAddress,
    paidAt: Date.now(),
    paymentMethodType: "card",
    isPaid: true,
  });

  return order;
};

//webhook
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  console.log("👉 Webhook endpoint hit");

  let event;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (endpointSecret) {
    console.log("🔐 Using endpoint secret for signature verification");

    const signature = req.headers["stripe-signature"];
    console.log("📩 Received signature:", signature);
 
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret
      );
      console.log("✅ Signature verified successfully");
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    console.warn("⚠️ No endpoint secret found — skipping verification");
    event = req.body;
  }

  console.log("📦 Received event type:", event.type);

  if (event.type === "checkout.session.completed") {
    try {
      console.log("🛒 Processing checkout.session.completed");
      console.log("📄 Session object:", event.data.object);

      await createOrder(event.data.object);

      console.log("✅ Order created successfully from webhook");
    } catch (err) {
      console.error("❌ Error creating order from webhook:", err.message);
    }
  } else {
    console.log("ℹ️ Event type not handled:", event.type);
  }

  res.status(200).json({ received: true });
});
