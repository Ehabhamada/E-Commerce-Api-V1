const express =require('express')
const CouponsRouter =express.Router()
const isLoggedin = require('../middlewares/isLogedinMidelwear')
const {createCoupon,getAllCoupons,getSingleCoupon,updateCoupon,deleteCoupon}=require('../controllers/couponsController')
const isAdmin = require('../middlewares/isAdminMidelwear')

CouponsRouter.route('/').post(isLoggedin,isAdmin,createCoupon).get(getAllCoupons)
CouponsRouter.route('/:id').get(getSingleCoupon).put(isLoggedin,isAdmin,updateCoupon).delete(isLoggedin,isAdmin,deleteCoupon)

 module.exports = CouponsRouter