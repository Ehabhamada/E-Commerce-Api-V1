const ReviewRouter = require('express').Router()

const { createReview ,getAllReviews,getSingleReview,updateReview,deleteReview} = require('../controllers/ReviewController')
const isAdmin = require('../middlewares/isAdminMidelwear')
const isLoggedin = require('../middlewares/isLogedinMidelwear')

ReviewRouter.route('/').get(getAllReviews)
ReviewRouter.route('/:productID').post(isLoggedin,isAdmin,createReview)
ReviewRouter.route('/:id').get(getSingleReview).put(isLoggedin,isAdmin,updateReview).delete(isLoggedin,isAdmin,deleteReview)


module.exports = ReviewRouter