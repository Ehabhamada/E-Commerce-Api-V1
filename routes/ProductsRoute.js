const express = require('express')
const productRouter = express.Router()
const { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct } = require('../controllers/ProductController')
const isLoggedin = require('../middlewares/isLogedinMidelwear')
const upload = require('../config/FileUpload')
const isAdmin = require('../middlewares/isAdminMidelwear')

productRouter.route('/').post(isLoggedin,isAdmin,upload.array('image'),createProduct).get(getAllProducts)
productRouter.route('/:id').get(getSingleProduct).put(isLoggedin,isAdmin,updateProduct).delete(isLoggedin,isAdmin,deleteProduct)

module.exports = productRouter