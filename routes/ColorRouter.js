const ColorRouter = require('express').Router()

const { createColor ,getAllColors,getSingleColor,updateColor,deleteColor} = require('../controllers/ColorController')
const isAdmin = require('../middlewares/isAdminMidelwear')
const isLoggedin = require('../middlewares/isLogedinMidelwear')

ColorRouter.route('/').post(isLoggedin,isAdmin,createColor).get(getAllColors)
ColorRouter.route('/:id').get(getSingleColor).put(isLoggedin,isAdmin,updateColor).delete(isLoggedin,isAdmin,deleteColor)


module.exports = ColorRouter