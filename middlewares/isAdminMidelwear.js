const User = require("../models/User");

const isAdmin = async (req, res, next) => {
  // find the user 
  const user = await User.findById(req.userAuthID);
  //   check if user is admin
  if (!user.isAdmin) {
    throw new Error("You are not an admin,Admins only can access this route");
  }
  next();
}

module.exports = isAdmin