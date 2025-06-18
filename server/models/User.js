const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

//creating userSchema to define a structure
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, 'Name is required'] },
        email: { type: String, required: [true, 'Email is required'], unique: true },
        phone: { type: String, required: [true, 'Phone number is required'], unique: true },
        password: { type: String, required: [true, 'Password is required'] },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    {
        timestamps: true
    }
)

//pre-hook to hash the new or updated password and update the database
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    //below salt will add random string to password and will then encrypt it
    //so if we have a lot of same password, hascode will be different 
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

//method to match the password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

//method to generate reset token for password change (forgotPassword)
userSchema.methods.generatePasswordResetToken = function () {
    //generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
    // Hash token and set to resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set expiration (15 mins from now)
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;