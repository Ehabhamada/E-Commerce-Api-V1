const Category = require("../models/Category");
// create category
const createCategory = async (req, res) => {
    const { name } = req.body;
    // category exists
    const categoryExists = await Category.findOne({  name: name.toLowerCase() });
    if (categoryExists) {
        throw new Error("Category already exists");
    }
    const category = await Category.create({
        name:name.toLowerCase(),
        user: req.userAuthID,
    });
    res.status(201).json({
        status: "success",
        message: "Category created successfully",
        category,
        image: req.file?.path
    });

}

// Get All Categories
const getAllCategories = async (req, res) => {
    const categories = await Category.find();
    res.status(200).json({
        status: "success",
        categories,
    });
}

// Get Single Category
const getSingleCategory = async (req, res) => {
    const category = await Category.findById(req.params.id);
    res.status(200).json({
        status: "success",
        category,
    });
}

// update category
const updateCategory = async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: "success",
        message: "Category updated successfully",
        category,
    });
}


// Delete Category
const deleteCategory = async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: "success",
        message: "Category deleted successfully",
        category,
    });
}

module.exports = { 
    getAllCategories, getSingleCategory, updateCategory, deleteCategory, createCategory 
}