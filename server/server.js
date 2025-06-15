const express = require("express");
const mongoose = require("mongoose")
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());    //tells express req.body to parse incoming json requests

app.use(cookieParser());

/****************************************************************************************** */
//-----connecting to a database-----//
const connectDB = require("./config/db")
connectDB() 
/****************************************************************************************** */


/****************************************************************************************** */
//-----Making Routes------//
//1. user routes


/****************************************************************************************** */

//```SERVER LISTENING AT PORT 3000```
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`CVSA backend server started at port: ${PORT} .... `);
});