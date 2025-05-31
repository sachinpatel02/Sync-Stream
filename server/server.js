const express = require("express");
const app = express();

app.use(express.json());    //tells express req.body to parse incoming json requests

/****************************************************************************************** */
//-----connecting to a database-----//
const connectDB = require("./config/db")
connectDB() 
/****************************************************************************************** */


/****************************************************************************************** */
//-----Making Routes------//
//1. user routes
const userRouter = require("./routes/userRoute");
app.use(userRouter, "/api/user")


/****************************************************************************************** */

//```SERVER LISTENING AT PORT 3000```
app.listen(process.env.PORT, () => {
    console.log(`CVSA backend server started at port: ${process.env.PORT} .... `);
});