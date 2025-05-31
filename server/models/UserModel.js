const mongoose = require("mongoose");

//creating schemaRules
const schemaRules = {
    name: { type: String, required: [true, "Name is required"] },
    email: { type: String, required: [true, "Email is required"] },
    password: { type: String, required: [true, "Password is required"], minLength: [8, "Password should be atleast of 8 chars"] },
    role: { type: String, required: true, enum: ["user", "admin"], default: "user" }
}

//creating userSchema
const userSchema = new mongoose.Schema(schemaRules);
//creating UserModel
const UserModel = mongoose.model("user", userSchema);

//exporting UserModel
module.exports = UserModel;