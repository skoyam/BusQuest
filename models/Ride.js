const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startLat: { type: Number, required: true },
    startLng: { type: Number, required: true },
    endLat: { type: Number },
    endLng: { type: Number },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    pointsEarned: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
});

const Ride = mongoose.models.Ride || mongoose.model('Ride', RideSchema);
module.exports = Ride;
