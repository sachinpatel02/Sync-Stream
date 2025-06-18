const express = require("express");
const mongoose = require("mongoose")
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require("cors");

const app = express();
app.use(express.json());    //tells express req.body to parse incoming json requests

app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3001',  //can add our app like https://syncstream.online etc
    credentials: true
}));
/****************************************************************************************** */
//-----connecting to a database-----//
const connectDB = require("./config/db")
connectDB();
/****************************************************************************************** */


/****************************************************************************************** */
//-----Making Routes------//

//1. user routes
const userRoutes = require("../server/routes/userRoutes.js");
app.use("/api/users", userRoutes);

//2. video routes
const videoRoutes = require("../server/routes/videoRoutes.js");
app.use("/api/videos", videoRoutes);

//3. session routes
const sessionRoutes = require("../server/routes/sessionRoutes.js");
app.use("/api/sessions/", sessionRoutes);


/****************************************************************************************** */

//```SERVER LISTENING AT PORT 3000```
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Sync Stream backend server started at port: ${PORT} .... `);
});