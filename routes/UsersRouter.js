const express =require('express')
const router =express.Router()
 const {Register,Login,getUserProfile,updateShippingAddress}=require('../controllers/UserControllers')
const isLoggedin = require('../middlewares/isLogedinMidelwear')

 router.post('/register',Register)
 router.post('/login',Login)
 router.get('/profile',isLoggedin,getUserProfile)
 router.put('/update/shipping',isLoggedin,updateShippingAddress)

 module.exports = router