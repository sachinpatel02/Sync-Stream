const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");
const { sendError } = require("../utils/sendResponse");

//check if the user is authorized, before calling any related controller
//this is based on cookies, we can implement header hased as well
const protect = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return sendError(res, 401, 'No token, authorization denied');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //below -password will remove password while storing user data in req.user object
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return sendError(res, 401, 'User not found');
        }
        next();
    } catch (err) {
        console.error(err);
        return sendError(res, 401, 'Invalid or Expired token');
    }

}

//check if the user is admin before calling any admin controllers
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role == 'admin') {
        return next();
    } else {
        sendError(res, 403, 'Access Denid: Admins only');
    }
}

module.exports = { protect, isAdmin };