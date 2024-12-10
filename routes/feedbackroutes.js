const express = require("express");
const Feedback = require("../models/feedback"); // Import the Feedback model
const router = express.Router();

// POST route to save feedback
router.post("/", async (req, res) => {
    const { name, email, feedback } = req.body;

    if (!name || !email || !feedback) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const newFeedback = new Feedback({ name, email, feedback });
        await newFeedback.save();
        res.status(201).json({ success: true, message: "Feedback submitted successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "An error occurred while saving feedback" });
    }
});

module.exports = router;