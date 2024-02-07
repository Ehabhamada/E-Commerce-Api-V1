const Review = require("../models/Review");
const Product = require("../models/product");

// create Review
const createReview = async (req, res) => {
    const{message,rating,product}=req.body
    // find the product
    const {productID} = req.params
    const productFound = await Product.findById(productID).populate('reviews')
    if(!productFound){
        throw new Error("Product not found")
    }
    // Check if user already reviewed this product
const hasReview = productFound?.reviews?.find(review => review.user.toString() === req.userAuthID.toString())
    if(hasReview){
        throw new Error("User already reviewed this product")
    }

    // create Review
    const review = await Review.create({
        message,
        rating,
        product:productFound._id,
        user:req.userAuthID
    })
    // push review into product found
    productFound.reviews.push(review)
    // save product found 
    await productFound.save()
    // send response 
    res.status(201).json({
        status: "success",
        message: "Review created successfully",
        review
    })
   
}
// Get All Reviews
const getAllReviews = async (req, res) => {
    const Reviews = await Review.find();
    res.status(200).json({
        status: "success",
        Reviews,
    });
}

// Get Single Review
const getSingleReview = async (req, res) => {
    const review = await Review.findById(req.params.id);
    res.status(200).json({
        status: "success",
        review,
    });
}


// update Review
const updateReview = async (req, res) => {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: "success",
        message: "Review updated successfully",
        review,
    });
}


// Delete Review
const deleteReview = async (req, res) => {
    const review = await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: "success",
        message: "Review deleted successfully",
        review,
    });
}

module.exports = { 
    getAllReviews, getSingleReview, updateReview, deleteReview, createReview 
}