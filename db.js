const mongoose = require('mongoose');
require('dotenv').config();

//Define mongoDB connection URL
// const mongoURL = process.env.MONGODB_URL_LOCAL; //here tvt is a database name
const mongoURL = process.env.MONGODB_URL; 

//setup MongoDB connection
mongoose.connect(mongoURL)
    .then(() => {
        console.log("Connected to MongoDB server");
    })
    .catch((err) => {
        console.error("MongoDB connection Error", err);
    });

// Get the default connection
const db = mongoose.connection; //handle events and interacts with database

db.on('disconnected', ()=>{
    console.log("MongoDB Disonnected");
});

// Export the database connection
module.exports = db;