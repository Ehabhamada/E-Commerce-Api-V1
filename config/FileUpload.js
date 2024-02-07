const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// create storage engine for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    allowedFormats: ["jpg", "png", "jpeg", "webp"],
    params: {
        folder: "full-e-commerce-api",
    },
});

// init storage engine
const upload = multer({ storage: storage });



module.exports = upload