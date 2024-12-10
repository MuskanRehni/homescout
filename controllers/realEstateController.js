const RealEstate = require("../models/RealEstate");
const path = require("path");
const fs = require("fs");

// Create a new real estate listing
exports.createRealEstate = async (req, res) => {
    try {
        const obj = req.body;

        obj.image = req.file.filename.split(" ").join("%20");

        const realEstate = new RealEstate(obj);
        await realEstate.save();
        res.status(201).json(realEstate);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all real estate listings
exports.getRealEstates = async (req, res) => {
    try {
        const realEstates = await RealEstate.find();
        res.status(200).json(realEstates);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get a single real estate listing by ID
exports.getRealEstateById = async (req, res) => {
    try {
        const realEstate = await RealEstate.findById(req.params.id);
        if (!realEstate)
            return res.status(404).json({ message: "Real estate not found" });
        res.status(200).json(realEstate);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update a real estate listing
exports.updateRealEstate = async (req, res) => {
    try {
        console.log("Request Body:", req.body);

        const obj = req.body;

        if (req.file) {
            obj.image = req.file.filename.split(" ").join("%20");
        }

        const realEstate = await RealEstate.findById(req.params.id);
        if (!realEstate)
            return res.status(404).json({ message: "Real estate not found" });

        const oldImage = realEstate.image.split("%20").join(" ");

        await realEstate.updateOne(obj);

        // Delete the old image from the uploads folder
        fs.rmSync(path.join(__dirname, `../uploads/property/${oldImage}`));

        res.status(200).json(realEstate);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a real estate listing
exports.deleteRealEstate = async (req, res) => {
    try {
        console.log("1");

        const realEstate = await RealEstate.findById(req.params.id);

        console.log("2");

        if (!realEstate)
            return res.status(404).json({ message: "Real estate not found" });

        console.log("3");

        const image = realEstate.image.split("%20").join(" ");

        console.log("4");

        await realEstate.deleteOne();

        console.log("5");

        // Delete the image from the uploads folder
        fs.rmSync(path.join(__dirname, `../uploads/property/${image}`));

        console.log("6");

        res.status(200).json({ message: "Real estate deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
