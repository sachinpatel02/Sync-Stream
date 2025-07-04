/**
 * we can create three different controllers as follow. (But as of now we are keeping this one only)
 * 1. authController.js --> handles registration, login, logout, forgot - reset password
 * 2. profileController.js --> handles getUserProfile, updateUserProfile, changePassword
 * 3. adminController.js --> handles getAllUsers, getUserById, updateUserById, deleteUser
 */
const User = require("../models/User");
const { sendSuccess, sendError } = require("../utils/sendResponse.js");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

//handles user registration
const registerUser = async (req, res) => {
    try {
        //input validation
        const { name, email, phone, password } = req.body;
        if (!name || !email || !phone || !password) {
            return sendError(res, 400, "All fields are required!");
        }

        //check if user exist or not
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return sendError(res, 400, "User with this email or phone already exist");
        }

        //user creation
        const user = await User.create({ name, email, phone, password });
        //return if creation is failed
        if (!user) {
            return sendError(res, 500, "User registration failed");
        }
        return sendSuccess(res, 201, "User registered successfully");
    } catch (error) {
        console.error(error);
        return sendError(res, 500, 'Something went wrong during registration');
    }
};

//handles user login
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d', });
};
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        //validate input
        if (!email || !password) {
            return sendError(res, 400, 'Email and password are requied');
        }
        //find user
        const user = await User.findOne({ email });

        //no user found or invalid password
        if (!user || !(await user.matchPassword(password))) {
            return sendError(res, 401, 'Invalid email or password');
        }

        //token generation
        const token = generateToken(user._id);

        //set JWT in httpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        return sendSuccess(res, 200, 'Login successful', {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        });
    } catch (err) {
        console.error(err);
        return sendError(res, 500, 'Login failed. Please try again later.');
    }
};

//handles user logout
const logoutUser = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    })
    return sendSuccess(res, 200, "Logout successfully!");
};

//handles forgot password -- this will send a link of reset password with a token
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return sendError(res, 400, 'Email is required');
        }
        //finding user
        const user = await User.findOne({ email });

        //return if user don't exist
        if (!user) {
            return sendError(res, 404, 'User with this email does not exist');
        }

        //generate token
        const resetToken = user.generatePasswordResetToken();
        await user.save({ validateBeforeSave: false });
        //below url usually sent through email, but here we will return in response. 
        //we will setup email afterwards
        const resetUrl = `http://localhost:3000/api/users/reset-password/${resetToken}`;
        return sendSuccess(res, 200, 'Password reset link generated', { resetUrl });
    } catch (err) {
        console.log(err);
        return sendError(res, 500, 'Failed to generate password reset link');
    }
};

//handles reset password -- this will get the token from reset-password link, update new password in db
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!newPassword) {
            return sendError(res, 400, 'New Password is required');
        }

        //hashing the token, so we can match it with stored token in database
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        //finding the user with hashedToken and time
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });
        if (!user) {
            return sendError(res, 400, 'Invalid or expired token');
        }

        //setting new password
        user.password = newPassword;

        //clearing tokens
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return sendSuccess(res, 200, 'Password reset successfully. You can now log in.');

    } catch (err) {
        console.error(err);
        return sendError(res, 500, 'Failed to reset password');
    }
};

//getting user profile details [before coming here it will go to authMiddleware/protect for authentication verification]
//this will return everythin except password - user must be logged in (/authMiddleware/protect will verify)
const getUserProfile = async (req, res) => {
    try {
        //below will get the user from protect if it exist. If it doesn't, it will be back from there only
        const user = req.user;

        if (!user) {
            return sendError(res, 404, 'User not found');
        }
        return sendSuccess(res, 200, 'User profile fetched successfully', {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        });

    } catch (err) {
        console.log(err);
        return sendError(res, 500, 'Failed to fetch user profile');
    }
};
//help user to update name, email, phone - user must be logged in (/authMiddleware/protect will verify)
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return sendError(res, 404, 'User not found');
        }

        //updating provided fields, keeping same fiels if not updated
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        const updatedUser = await user.save();

        return sendSuccess(res, 200, 'Profile updated successfully', {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.role,
        });

    } catch (err) {
        console.log(err);
        return sendError(res, 500, 'Failed to update user profile');
    }
};

//changing the password - user must be logged in (/authMiddleware/protect will verify)
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        
        if (!oldPassword || !newPassword) {
            return sendError(res, 400, 'Both old and new passwords are required');
        }
        const user = await User.findById(req.user._id);
        if (!user) {
            return sendError(res, 404, 'User not found');
        }
        //match the old-password using User.matchPassword method
        const isMatch = await user.matchPassword(oldPassword);
        if (!isMatch) {
            return sendError(res, 401, 'Old Password is incorrect');
        }
        user.password = newPassword;
        await user.save();

        return sendSuccess(res, 200, 'Password Changed Successfully');

    } catch (err) {
        console.log(err);
        return sendError(res, 500, 'Failed to change password');
    }
};

//below three functions can only be accessed with admin access
//getAllUsers --> return all users (name, email, phone) - no password
//getUserById --> return specific user detials except password
//deleteUser --> delete user from database
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // return all fields except password
        return sendSuccess(res, 200, 'All users fetched successfully', users);
    } catch (err) {
        console.log(err);
        return sendError(res, 500, 'Failed to fetch all users');
    }
};
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return sendError(res, 404, 'User not found');
        }

        return sendSuccess(res, 200, 'User fetched successfully', user);

    } catch (err) {
        console.log(err);
        return sendError(res, 500, 'Failed to fetch user details')
    }
};
const updateUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return sendError(res, 404, 'User not found');
        }

        //updating user and returning
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.role = req.body.role || user.role;
        const updatedUser = await user.save();
        return sendSuccess(res, 200, 'User updated successfully', {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.role,
        });

    } catch (error) {
        console.log(error);
        return sendError(res, 500, 'Failed to update user')
    }
};
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return sendError(res, 404, 'User not found');
        }

        //await user.remove();
        return sendSuccess(res, 200, 'User deleted successfully');

    } catch (error) {
        console.log(error);
        return sendError(res, 500, 'Failed to delete user')
    }
};

module.exports = {
    registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserProfile, updateUserProfile, changePassword, getAllUsers, getUserById, updateUserById, deleteUser
};