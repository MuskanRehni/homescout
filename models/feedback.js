const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    feedback: { type: String, required: true },
    date: { type: Date, default: Date.now } // Optional: To track submission date
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;