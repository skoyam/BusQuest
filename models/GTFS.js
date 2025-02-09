// models/GTFS.js (CommonJS Fix)
const mongoose = require('mongoose');

const StopSchema = new mongoose.Schema({
    stop_id: String,
    stop_name: String,
    stop_lat: Number,
    stop_lon: Number,
});

const StopTimeSchema = new mongoose.Schema({
    trip_id: { type: String, ref: 'Trip' },
    arrival_time: String,
    departure_time: String,
    stop_id: { type: String, ref: 'Stop' },
    stop_sequence: Number,
});

const ShapeSchema = new mongoose.Schema({
    shape_id: String,  // Shape ID from shapes.txt
    trip_id: { type: String, ref: 'Trip' },  // Trip that uses this shape
    shape_pt_lat: Number,
    shape_pt_lon: Number,
    shape_pt_sequence: Number,
});

const RouteSchema = new mongoose.Schema({
    route_id: String,
    route_short_name: String,
    route_long_name: String,
    route_type: Number,
});

const TripSchema = new mongoose.Schema({
    route_id: { type: String, ref: 'Route' },
    service_id: String,
    trip_id: String,
    trip_headsign: String,
    stop_times: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StopTime' }],
    shape_id: String,  // Directly store the shape_id for easy lookup
});

const Stop = mongoose.models.Stop || mongoose.model('Stop', StopSchema);
const StopTime = mongoose.models.StopTime || mongoose.model('StopTime', StopTimeSchema);
const Shape = mongoose.models.Shape || mongoose.model('Shape', ShapeSchema);
const Route = mongoose.models.Route || mongoose.model('Route', RouteSchema);
const Trip = mongoose.models.Trip || mongoose.model('Trip', TripSchema);

module.exports = { Stop, StopTime, Shape, Route, Trip };
