const BrandRouter = require('express').Router()

const { createBrand ,getAllBrands,getSingleBrand,updateBrand,deleteBrand} = require('../controllers/BrandController')
const isAdmin = require('../middlewares/isAdminMidelwear')
const isLoggedin = require('../middlewares/isLogedinMidelwear')

BrandRouter.route('/').post(isLoggedin,isAdmin,createBrand).get(getAllBrands)
BrandRouter.route('/:id').get(getSingleBrand).put(isLoggedin,isAdmin,updateBrand).delete(isLoggedin,isAdmin,deleteBrand)


module.exports = BrandRouter