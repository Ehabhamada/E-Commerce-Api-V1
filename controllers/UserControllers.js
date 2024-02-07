const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken.js');
const getTokenFromHeaders = require('../utils/getTokenFromHeaders.js');
const verifyToken = require('../utils/verifyToken.js');
require('express-async-handler')

const Register = async (req, res) => {
        const { fullName, email, password } = req.body;

        const userExists = await User.findOne({ email });
        
        if (userExists) {
            throw new Error('User Already Exists')
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword
        });
         
        res.json({
            user: user
        });
    } 


const Login = async (req, res) => {
        const { email, password } = req.body;

        const userFound = await User.findOne({ email });

        if (userFound && (await bcrypt.compare(password, userFound.password))) {
            console.log("userFound:--",userFound._id);
            res.json({
                status: 'Success',
                msg: 'Login Successfully',
                userFound,
                token:generateToken(userFound._id)
            });
        } else {
           throw new Error('Invalid Login')
        } 
    } 
// Get User Profile
const getUserProfile= async (req,res)=>{
// find the user
 const user = await User.findById(req.userAuthID).populate('orders');
// send response
 res.json({
    status: "success",
    message: "User profile fetched successfully",
    user
 })

}

// Updae User Shipping Address
const updateShippingAddress = async (req, res) => {
  const { firstName, lastName, address, city, postalCode, province, phone, country } = req.body;
  const userId = req.userAuthID;
  
    const user = await User.findByIdAndUpdate(userId,{
        shippingAddress: {
          firstName,
          lastName,
          address,
          city,
          postalCode,
          province,
          phone,
          country
        },
        hasShipingAddress: true,
      },
    { new: true }
    )

    // send response
    res.json({ 
        status: "success",
        message: "Shipping Address updated successfully",
        user
     });
};

module.exports = {
    Register,
    Login,
    getUserProfile,
    updateShippingAddress
};
