const Coupon = require("../models/Coupon");
//  Create new Coupon
const createCoupon = async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  // Check if Admin
  // if (req.user.role !== "admin") {
  //   throw new Error("Only admins can create coupons");
  // }
  // Check if coupon already exists
  const couponExists = await Coupon.findOne({ code });
  if (couponExists) {
    throw new Error("Coupon already exists");
  }
  // check if discount is a number
  if (isNaN(discount)) {
    throw new Error("Discount must be a number");
  }

  // Create coupon
  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    startDate,
    endDate,
    discount,
    user: req.userAuthID,
  });
  // Send response
  res.status(201).json({
    success: true,
    message: "Coupon created successfully",
    data: coupon,
  });
};

//Get all coupons
const getAllCoupons = async (req, res) => {
  const coupons = await Coupon.find();
  res.status(200).json({
    success: true,
    message: "All Coupons fetched successfully",
    count: coupons.length,
    data: coupons,
  });
};

//Get single coupon
const getSingleCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    return res
      .status(404)
      .json({ success: false, message: "Coupon not found" });
  }
  res.status(200).json({ success: true, data: coupon });
};

// Update coupon
const updateCoupon = async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    { code: code.toUpperCase(), startDate, endDate, discount },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!coupon) {
    return res.status(404).json({
       success: false, message: "Coupon not found" 
      });
  }
  res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      data: coupon,
    });
};

// Delete coupon
const deleteCoupon = async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) {
    return res
      .status(404)
      .json({ success: false, message: "Coupon not found" });
  }
  res
    .status(200)
    .json({ success: true, message: "Coupon deleted successfully" });
};

module.exports = {
  createCoupon,
  getAllCoupons,
  getSingleCoupon,
  updateCoupon,
  deleteCoupon,
};
