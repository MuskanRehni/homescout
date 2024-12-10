const mongoose = require("mongoose");

// Define the schema for a service
const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    workType: {
        type: String,
        required: true,
        enum: ["maid", "babysitter", "cook", "eldercare", "driver"], // Allowed work types
    },
    gender: {
        type: String,
        required: true,
        enum: ["female", "male", "other"],
    },
    workHours: {
        type: Number,
        required: true,
    },
    experience: {
        type: Number,
        required: true,
        min: 0, // Ensures no negative values
    },
    location: {
        type: String,
        required: true,
        enum: ["Kolkata", "Mumbai", "Bangalore", "Delhi", "Punjab"], // Allowed locations
    },
    contact: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically sets the creation timestamp
    },
});

// Create and export the model
const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;