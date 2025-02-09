const mongoose = require('mongoose');

const StopSchema = new mongoose.Schema({
    stop_id: String,
    stop_name: String,
    stop_lat: { type: Number, required: true }, // Store plain lat
    stop_lon: { type: Number, required: true }, // Store plain lon
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true } // GeoJSON requires [longitude, latitude]
    }
});

// ✅ Ensure geospatial index is created for fast $nearSphere queries
StopSchema.index({ location: "2dsphere" });

const Stop = mongoose.models.Stop || mongoose.model('Stop', StopSchema);
module.exports = Stop;
