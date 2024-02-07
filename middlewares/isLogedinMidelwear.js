const getTokenFromHeaders = require("../utils/getTokenFromHeaders")
const verifyToken = require("../utils/verifyToken")
/*  
 * Middleware to check if the user is logged in.
 * If the user is logged in, it saves the user's ID to the request object and calls the next middleware.
 * If the user is not logged in or the token is expired or invalid, it throws an error.
*/
const isLoggedin =(req,res,next)=>{
  // Get Token From Header
  const token = getTokenFromHeaders(req)
  // Verify Token
  const decodedUser =verifyToken(token)
if (!decodedUser) {
    throw new Error('Token Expired Or Invalid ,Please Login again')
}else{
    // Save The User Into req obj
    req.userAuthID =decodedUser?.id
    next()
}

}


module.exports = isLoggedin