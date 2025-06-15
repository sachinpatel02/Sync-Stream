/**
 * we can create three different controllers as follow. (But as of now we are keeping this one only)
 * 1. authController.js --> handles registration, login, logout, forgot - reset password
 * 2. profileController.js --> handles getUserProfile, updateUserProfile, changePassword
 * 3. adminController.js --> handles getAllUsers, getUserById, updateUserById, deleteUser
 */
const { sendSuccess, sendError } = requrie("../utils/sendResponse.js");
const registerUser = async () => { };
const loginUser = async () => { };
const logoutUser = async () => { };
const forgotPassword = async () => { };
const resetPassword = async () => { };

const getUserProfile = async () => { };
const updateUserProfile = async () => { };
const changePassword = async () => { };

const getAllUsers = async () => { };
const getUserById = async () => { };
const updateUserById = async () => { };
const deleteUser = async () => { };

module.exports = {
    registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserProfile, updateUserProfile, changePassword, getAllUsers, getUserById, updateUserById, deleteUser
};