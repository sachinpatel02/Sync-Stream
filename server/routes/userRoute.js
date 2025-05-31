const express = require("express");
const userRouter = express.Router();

userRouter
    .post("/", createUser)
    .get("/", getAllUsers)
    .get("/:id", getUserById)
    .delete("/:id", deleteUserById)

module.exports = userRouter;