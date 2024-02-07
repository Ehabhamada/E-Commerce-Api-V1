const Color = require("../models/Color");

// create Color
const createColor = async (req, res) => {
    const { name } = req.body;
    const colorExists = await Color.exists({ name: name.toLowerCase() });

    if (colorExists) {
        throw new Error("Color already exists");
    }

    const color = await Color.create({
        name: name.toLowerCase(),
        user: req.userAuthID,
    });

    res.status(201).json({
        status: "success",
        message: "Color created successfully",
        color,
    });
}
// Get All Colors
const getAllColors = async (req, res) => {
    const colors = await Color.find();
    res.status(200).json({
        status: "success",
        colors,
    });
}

// Get Single Color
const getSingleColor = async (req, res) => {
    const color = await Color.findById(req.params.id);
    res.status(200).json({
        status: "success",
        color,
    });
}

// update Color
const updateColor = async (req, res) => {
    const color = await Color.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: "success",
        message: "Color updated successfully",
        color,
    });
}


// Delete Color
const deleteColor = async (req, res) => {
    const color = await Color.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: "success",
        message: "Color deleted successfully",
        color,
    });
}

module.exports = { 
    getAllColors, getSingleColor, updateColor, deleteColor, createColor 
}