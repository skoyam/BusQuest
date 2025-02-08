// models/BusStop.js
import mongoose from 'mongoose';

const BusStopSchema = new mongoose.Schema({
    stopId: String, // from GTFS
    name: String,
    latitude: Number,
    longitude: Number,
    // e.g. track congestion as an enum or numeric scale:
    congestionLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' },
});

export default mongoose.models.BusStop || mongoose.model('BusStop', BusStopSchema);
