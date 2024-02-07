require('dotenv').config();
const express = require('express');
require('express-async-errors');
const dbConnect = require('../config/DBConnect');
const usersRouter=require('../routes/UsersRouter')
const productsRoute=require('../routes/ProductsRoute')
const categoryRouter=require('../routes/CategoriesRouter')
const BrandRouter = require('../routes/BrandsRouter');
const ColorRouter = require('../routes/ColorRouter');
const ReviewRouter = require('../routes/ReviewsRouter');
const orderRouter = require('../routes/OrderRouter');
const Order = require('../models/Order');
const CouponsRouter = require('../routes/CouponsRouter');
const globalErrorHandler = require('../middlewares/globalErrorHandler')
const notFound = require('../middlewares/notFound');
const Stripe  = require('stripe');
// Connect with db
dbConnect()
const app = express()
//Stripe webhook
//stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_79f0ceff899251fcb36b8ce23c30bb83e628794b3643c9100d888354cf54cbd5";

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log("event");
    } catch (err) {
      console.log("err", err.message);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    if (event.type === "checkout.session.completed") {
      //update the order
      const session = event.data.object;
      const { orderId } = session.metadata;
      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total;
      const currency = session.currency;
      //find the order
      const order = await Order.findByIdAndUpdate(
        JSON.parse(orderId),
        {
          totalPrice: totalAmount / 100,
          currency,
          paymentMethod,
          paymentStatus,
        },
        {
          new: true,
        }
      );
      console.log(order);
    } else {
      return;
    }
    response.send();
  }
);

// Middleware
app.use(express.json())
// Routes
app.use('/api/v1/users',usersRouter)
app.use('/api/v1/products',productsRoute)
app.use('/api/v1/categories',categoryRouter)
app.use('/api/v1/brands',BrandRouter)
app.use('/api/v1/colors',ColorRouter)
app.use('/api/v1/reviews',ReviewRouter)
app.use('/api/v1/orders',orderRouter)
app.use('/api/v1/coupons',CouponsRouter)
// Middleware
app.use(notFound)
app.use(globalErrorHandler)

module.exports = app
