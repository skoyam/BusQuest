// models/Ride.js
import mongoose from 'mongoose';

const RideSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startTime: { type: Date },
    endTime: { type: Date },
    startLat: Number,
    startLng: Number,
    endLat: Number,
    endLng: Number,
    pointsEarned: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Ride || mongoose.model('Ride', RideSchema);
