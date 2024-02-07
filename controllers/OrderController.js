const Coupon = require("../models/Coupon");
const Order = require("../models/Order");
const User = require("../models/User");
const product = require("../models/product");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_KEY);
const dominName = "http://localhost:5000";
const createOrder = async (req, res) => {
  // get Coupon
  const {coupon} = req.query;
  console.log(coupon);

  // check if coupon is valid
 const couponFound = await Coupon.findOne({
    code: coupon?.toUpperCase(),
  });
  //  check if coupon is Expired
  if (couponFound?.isExpired) {
      throw new Error("Coupon has expired");
    }
//  check if coupon is not found
if (!couponFound) {
  throw new Error("Coupon not found");
}
// Get Discount
const discount = couponFound?.discount / 100;
  // Get The Payload (Customer, orderItems, ShippingAddress,totalPrice)
  const { orderItems, shippingAddress, totalPrice } = req.body;
  //Find The user
  const user = await User.findById(req.userAuthID);

  // Check if user has Shipping Address
  if (!user.shippingAddress) {
    throw new Error("Please Add Shipping Address");
  }

  // Check if Order Is Not Empty
  if (orderItems <= 0) {
    throw new Error("Cart is Empty");
  }

  // Place/Create Order - save into DB
  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
  });
  console.log(order);
  // Update Product Quantity
  const products = await product.find({ _id: { $in: orderItems } });
  orderItems?.map(async (order) => {
    const product = products?.find(
      (product) => product?._id.toString() === order?._id.toString()
    );
    if (product) {
      product.totalSold += Number(order?.qty);
    }
    await product.save();
  });

  //   push order into user
  user.orders.push(order?._id);
  await user.save();

  //make payment (stripe)
  //convert order items to have same structure that stripe need
  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item?.name,
          description: item?.description,
        },
        unit_amount: item?.price * 100,
      },
      quantity: item?.qty,
    };
  });
  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata: {
      orderId: JSON.stringify(order?._id),
    },
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });
  res.send({ url: session.url });

  // Paymen Webhook
  // update The User Order
};

// Get All Orders
const getAllOrders = async (req, res) => {
  const orders = await Order.find();
  res.status(200).json({ status: "success",count: orders.length,message: "All Orders", orders });
};

// get single order
const getSingleOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.status(200).json({ status: "success", message: "Single Order", order });
};
// Update Order
const updateOrder = async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, 
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  res.status(200).json({ status: "success", message: 'Order updated successfully', order });
};

// Get Orders Statistics
const getOrdersStatistics = async (req, res) => {
  // Get Orders Statistics 
  const OrdersStatistics = await Order.aggregate([
    { $group:
       { 
        _id: null,
         totalSales: { $sum: '$totalPrice' },
         minmumSales: { $min: '$totalPrice' },
         maximumSales: { $max: '$totalPrice' },
         averageSales: { $avg: '$totalPrice' },
         totalOrders: { $count: {} },
       } },
  ]);
  
  // get Date
  const date = new Date(Date.now())
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(lastMonth.setMonth(lastMonth.getMonth() - 1));
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // Adjust for local time zone
  lastMonth.setHours(0, 0, 0, 0);
  previousMonth.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  console.log("date:--",date);
  console.log("today:--",today);
  console.log("lastMonth:--",lastMonth);

  // get Sales Today
  const saleToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte:today,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);
  
  // get Sales Last Month
  const salesLastMonth = await Order.aggregate([
    { $match: { createdAt: { $gte: previousMonth } } },
    { $group:{ _id: null, totalSales: { $sum: '$totalPrice' } } },
  ])
  
  // get Sales Last Year
  const salesLastYear = await Order.aggregate([
    { $match: { createdAt: { $gte: lastMonth } } },
    { $group:{ _id: null, totalSales: { $sum: '$totalPrice' } } },
  ])
 
  res.status(200).json({ status: "success", message: "Order Statistics", OrdersStatistics, saleToday, salesLastMonth, salesLastYear });
};


module.exports = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  getOrdersStatistics,
};
