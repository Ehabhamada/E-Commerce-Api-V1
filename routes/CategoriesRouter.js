const categoryRouter = require('express').Router()

const CategoryFileUpload = require('../config/CategoryFileUpload')
const { createCategory ,getAllCategories,getSingleCategory,updateCategory,deleteCategory} = require('../controllers/CategoriesController')
const isAdmin = require('../middlewares/isAdminMidelwear')
const isLoggedin = require('../middlewares/isLogedinMidelwear')

categoryRouter.route('/').post(isLoggedin,isAdmin,CategoryFileUpload.single('image'),createCategory).get(getAllCategories)
categoryRouter.route('/:id').get(getSingleCategory).put(isLoggedin,isAdmin,updateCategory).delete(isLoggedin,isAdmin,deleteCategory)


module.exports = categoryRouter