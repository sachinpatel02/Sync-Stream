const express = require("express");
const router = express.Router();

//
const {
    registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserProfile, updateUserProfile, changePassword, getAllUsers, getUserById, updateUserById, deleteUser
} = require("../controllers/userController");

const { protect, isAdmin } = require("../middlewares/authMiddleware");

//we can create routes per below syntax
// router.METHOD('/path', middleware, method)
//middleware can be used to identify public, private, admin only etc. route access

//public routes
router.post('/register', registerUser);
router.post('login', loginUser);
router.post('logout', logoutUser);
router.post('forgot-password', forgotPassword);
router.put('reset-password/:token', resetPassword);

//private routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('change-password', protect, changePassword);

//admin-only routes
router.get('/', protect, isAdmin, getAllUsers);
router.get('/:id', protect, isAdmin, getUserById);
router.put('/:id', protect, isAdmin, updateUserById);
router.delete('/:id', protect, isAdmin, deleteUser);

module.exports = router;