// const express = require('express');
// const router = express.Router();
// const realEstateController = require('../controllers/realEstateController');

// // Routes for CRUD operations on real estate
// router.post('/', realEstateController.createRealEstate);
// router.get('/', realEstateController.getRealEstates);
// router.get('/:id', realEstateController.getRealEstateById);
// router.put('/:id', realEstateController.updateRealEstate);
// router.delete('/:id', realEstateController.deleteRealEstate);

// module.exports = router;
const express = require("express");
const router = express.Router();
const realEstateController = require("../controllers/realEstateController");
const multer = require("multer");
const path = require("path");
const RealEstate = require("../models/RealEstate");
// const authMiddleware = require('../middleware/auth'); // assuming you have an auth middleware

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("File:", file);
        const uploadFolder = "../uploads/property";
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

// Routes for CRUD operations on real estate
router.post("/", upload.single("image"), realEstateController.createRealEstate);
router.get("/", realEstateController.getRealEstates);
router.get("/:id", realEstateController.getRealEstateById);
router.put("/:id", upload.single("image"), realEstateController.updateRealEstate);
router.delete("/:id", realEstateController.deleteRealEstate);

module.exports = router;
