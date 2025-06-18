//```DB CONNECTION```
const mongoose = require("mongoose");

//```DOTENV to hiding imp info in a file```
const dotenv = require("dotenv");
dotenv.config();


const connectDB = async function () {
    try {
        const dbLink = process.env.MONGO_URI;
        const conn = await mongoose.connect(dbLink);
        console.log(`Connected to database...[host] : ${conn.connection.host}`);
        console.log(`Connected to database...[port] : ${conn.connection.port}`);
        console.log(`Connected to database...[name] : ${conn.connection.name}`);

    } catch (error) {
        console.log(`Mongodb connection error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;