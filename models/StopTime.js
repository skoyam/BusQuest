const mongoose = require('mongoose');

const StopTimeSchema = new mongoose.Schema({
    trip_id: String,
    arrival_time: String,
    departure_time: String,
    stop_id: String,
    stop_sequence: Number
});

const StopTime = mongoose.models.StopTime || mongoose.model('StopTime', StopTimeSchema);
module.exports = StopTime;
