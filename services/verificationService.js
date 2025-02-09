const Ride = require('../models/Ride');
const Stop = require('../models/Stop');
const dbConnect = require('../lib/dbConnect');

// Function to calculate approximate distance between two lat/lon points in meters
function simpleDistance(lat1, lon1, lat2, lon2) {
    const dx = (lat2 - lat1) * 111139; // Approximate meters per latitude degree
    const dy = (lon2 - lon1) * 111139 * Math.cos(lat1 * Math.PI / 180); // Adjust for longitude
    return Math.sqrt(dx * dx + dy * dy);
}

async function verifyRide(rideId) {
    await dbConnect();

    console.log(`🔍 Verifying ride: ${rideId}`);

    const ride = await Ride.findById(rideId);
    if (!ride) {
        console.log("❌ Ride not found");
        return false;
    }
    console.log(`✅ Ride found: (${ride.startLat}, ${ride.startLng})`);

    // 🔥 Fetch all stops from database
    const allStops = await Stop.find({});
    console.log(`📍 Loaded ${allStops.length} stops from database`);

    let closestStop = null;
    let minDistance = Number.MAX_VALUE;

    console.log("📌 Calculating distances to all stops:");

    allStops.forEach(stop => {
        const distance = simpleDistance(
            ride.startLat,
            ride.startLng,
            stop.stop_lat,
            stop.stop_lon
        );

        console.log(`🛑 Stop: ${stop.stop_name} at (${stop.stop_lat}, ${stop.stop_lon}) ➝ Distance: ${distance.toFixed(2)}m`);

        if (distance < minDistance && distance <= 100) { // 100m error threshold
            minDistance = distance;
            closestStop = stop;
        }
    });

    if (!closestStop) {
        console.log(`❌ No stop found within 100m of (${ride.startLat}, ${ride.startLng})`);
        return false;
    }

    console.log(`✅ Matched stop: ${closestStop.stop_name} at (${closestStop.stop_lat}, ${closestStop.stop_lon}) within ${minDistance.toFixed(2)}m`);

    return true;
}

module.exports = { verifyRide };
