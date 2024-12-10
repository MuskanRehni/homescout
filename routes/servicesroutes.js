const express = require("express");
const Service = require("../models/servicemodel"); // Import the service model
const multer = require("multer");
const path = require("path");
const { rmSync } = require("fs");

const router = express.Router();

// Upload Files

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("File:", file);
        const uploadFolder = "../uploads/services";
        cb(null, path.join(__dirname, uploadFolder));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

        const fileName = `${uniqueSuffix}-${file.originalname}`;

        console.log("File Name:", fileName);

        cb(null, fileName);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only Image files are allowed!"));
        }
    },
});

// Route to add a new service
router.post("/add", upload.single("image"), async (req, res) => {
    const { name, workType, experience, contact, location, gender, workHours } =
        req.body;

    const fileFromUser = req.file;

    const fileName = fileFromUser.filename.split(" ").join("%20");

    // Validate input
    if (
        !name ||
        !workType ||
        !experience ||
        !contact ||
        !location ||
        !gender ||
        !workHours
    ) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const newService = new Service({
            name,
            workType,
            experience,
            contact,
            location,
            gender,
            workHours,
            image: fileName,
        });
        const savedService = await newService.save();

        res.status(201).json({
            message: "Service added successfully",
            service: savedService,
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to add service",
            details: error.message,
        });
    }
});

// Route to get all services
router.get("/", async (req, res) => {
    try {
        const services = await Service.find();

        res.status(200).json(services);
    } catch (error) {
        console.error("Error fetching services:", error.message);
        res.status(500).json({
            error: "Failed to fetch services",
            details: error.message,
        });
    }
});

// Route to update a service by ID
router.put("/:id", upload.single("image"), async (req, res) => {
    try {
        const obj = req.body;

        console.log("Update request body:", req.body);

        const id = req.params.id;

        const updatedService = await Service.findById(id);

        if (!updatedService) {
            return res.status(404).json({ error: "Service not found" });
        }

        const fileFromUser = req.file;

        if (fileFromUser) {
            obj.image = fileFromUser.filename.split(" ").join("%20");
        }

        const oldFileName = updatedService.image.split("%20").join(" ");

        await updatedService.updateOne(obj);

        // Delete old image
        if (fileFromUser) {
            rmSync(path.join(__dirname, `../uploads/services/${oldFileName}`));
        }

        console.log("Updated service:", updatedService);

        res.status(200).json({
            message: "Service updated successfully",
            service: updatedService,
        });
    } catch (error) {
        console.error("Error updating service:", error.message);
        res.status(500).json({
            error: "Failed to update service",
            details: error.message,
        });
    }
});

// Route to delete a service by ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        console.log("Delete request ID:", id);

        const deletedService = await Service.findByIdAndDelete(id);

        if (!deletedService) {
            return res.status(404).json({ error: "Service not found" });
        }

        console.log("Deleted service:", deletedService);

        const fileName = deletedService.image.split("%20").join(" ");

        rmSync(path.join(__dirname, `../uploads/services/${fileName}`));

        res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
        console.error("Error deleting service:", error.message);
        res.status(500).json({
            error: "Failed to delete service",
            details: error.message,
        });
    }
});

module.exports = router;
