const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");
        await initDB();
    } catch (err) {
        console.error("Error connecting to MongoDB or initializing DB:", err);
    } finally {
        mongoose.connection.close();
    }
}

const initDB = async () => {
    try {
        // Delete existing listings if any
        await Listing.deleteMany({});
        console.log("Existing data deleted");

        // Map the data with the owner field
        const dataToInsert = initData.data.map((obj) => ({
            ...obj,
            owner: new mongoose.Types.ObjectId("66b24d146ed5f611b6686974"), // Use 'new' keyword here
        }));

        console.log("Data to insert:", dataToInsert);

        // Insert the new data
        await Listing.insertMany(dataToInsert);
        console.log("Data was initialized");
    } catch (err) {
        console.error("Error initializing data:", err);
    }
}

main();
