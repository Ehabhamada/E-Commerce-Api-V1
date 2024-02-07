const express =require('express')
const orderRouter =express.Router()
 const {createOrder,getAllOrders,getSingleOrder,updateOrder,getOrdersStatistics}=require('../controllers/OrderController')
const isLoggedin = require('../middlewares/isLogedinMidelwear')
const isAdmin = require('../middlewares/isAdminMidelwear')

orderRouter.route('/').post(isLoggedin,isAdmin,createOrder).get(isLoggedin,isAdmin,getAllOrders)
orderRouter.route('/stats').get(isLoggedin,isAdmin,getOrdersStatistics)
orderRouter.route('/:id').get(isLoggedin,isAdmin,getSingleOrder).put(isLoggedin,isAdmin,updateOrder)

 module.exports = orderRouter