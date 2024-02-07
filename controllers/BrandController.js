const Brand = require("../models/Brand");
// create Brand
// create Brand
const createBrand = async (req, res) => {
    const { name } = req.body;
    const brandExists = await Brand.exists({ name: name.toLowerCase() });

    if (brandExists) {
        throw new Error("Brand already exists");
    }

    const brand = await Brand.create({
        name: name.toLowerCase(),
        user: req.userAuthID,
    });

    res.status(201).json({
        status: "success",
        message: "Brand created successfully",
        brand,
    });
}
// Get All Brands
const getAllBrands = async (req, res) => {
    const brands = await Brand.find();
    res.status(200).json({
        status: "success",
        brands,
    });
}

// Get Single Brand
const getSingleBrand = async (req, res) => {
    const brand = await Brand.findById(req.params.id);
    res.status(200).json({
        status: "success",
        brand,
    });
}

// update Brand
const updateBrand = async (req, res) => {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: "success",
        message: "Brand updated successfully",
        brand,
    });
}


// Delete Brand
const deleteBrand = async (req, res) => {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: "success",
        message: "Brand deleted successfully",
        brand,
    });
}

module.exports = { 
    getAllBrands, getSingleBrand, updateBrand, deleteBrand, createBrand 
}