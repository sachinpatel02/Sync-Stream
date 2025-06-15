const express = require("express");
const mongoose = require("mongoose")
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());
app.use(express.json());    //tells express req.body to parse incoming json requests

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
app.listen(process.env.PORT, () => {
    console.log(`CVSA backend server started at port: ${process.env.PORT} .... `);
});