const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const http = require("http");
const {Server} = require("socket.io");


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
//-----Load and use socket handler----//
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3001',
        credentials: true
    }
})

const socketHandler = require('./socket/socketHandler.js');
socketHandler(io);

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

//4. TMDB routes for admin only
const tmdbRoutes = require("../server/routes/tmdbRoutes.js");
app.use("/api/tmdb", tmdbRoutes);

//5. Pexels routes for admin only
const pexelsRoutes = require("../server/routes/pexelsRoutes.js");
app.use("/api/pexels", pexelsRoutes);

/****************************************************************************************** */

//```SERVER LISTENING AT PORT 3000```
const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`Sync Stream backend server started at port: ${PORT} .... `);
});