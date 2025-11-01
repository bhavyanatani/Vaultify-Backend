const mongoose = require('mongoose');
require('dotenv').config();
const mongoURI = process.env.MONGO_DB_URI;
const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to Mongo Successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

module.exports = connectToMongo;