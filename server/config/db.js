    //```DB CONNECTION```
const mongoose = require("mongoose");

//```DOTENV to hiding imp info in a file```
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async function () {
    const dbLink = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cvsacluster1.qceftbo.mongodb.net/?retryWrites=true&w=majority&appName=cvsaCluster1`
    mongoose.connect(dbLink).then(function (connection) {
        console.log("Connected to the database...");
    }).catch(err => console.log(err))
}

module.exports = connectDB;