
const mongoose = require('mongoose');

const RealEstateSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    image: { type: String, required: true },
    datePosted: { type: Date, default: Date.now },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    propertyType: { type: String, enum: ['apartment', 'house', 'villa'], default: 'apartment' }
});

module.exports = mongoose.model('RealEstate', RealEstateSchema);
