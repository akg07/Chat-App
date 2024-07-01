const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if(req.headers.authorization && 
    req.headers.authorization.startsWith("Bearer")
  ) {
    try{
      token = req.headers.authorization.split(" ")[1];

      //decode the id from token
      const decode = jwt.verify(token, process.env.JWT_SECERT);

      req.user = await User.findById(decode.id).select("-password");

      next();
    }catch(er) {
      res.status(401);
      throw new Error("Not Authorized, Token failed");
    }
  }

  if(!token) {
    res.status(401);
    throw new Error("Not authorized, no token!!");
  }
});

module.exports = { protect }