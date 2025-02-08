// app/services/verificationService.js (or pages/api/services... up to you)

import Ride from '@/models/Ride';
import Stop from '@/models/Stop';
import StopTime from '@/models/StopTime';
import mongoose from 'mongoose';

export async function verifyRide(rideId) {
    const ride = await Ride.findById(rideId);
    if (!ride) return false;

    // 1. Find nearest boarding stop
    const boardStop = await findNearestStop(ride.boardLat, ride.boardLng);
    // 2. Find nearest deboarding stop
    const endStop = await findNearestStop(ride.endLat, ride.endLng);

    // 3. Check if time matches schedule for route
    const boardValid = await isTimeMatch(boardStop?.stop_id, ride.route, ride.boardTime);
    const endValid = await isTimeMatch(endStop?.stop_id, ride.route, ride.endTime, {
        afterStopId: boardStop?.stop_id // optionally ensure the stop_sequence is after boardStop
    });

    const verified = boardValid && endValid;

    // 4. Update Ride doc with results
    ride.verified = verified;
    if (boardStop) ride.boardStopId = boardStop.stop_id;
    if (endStop) ride.endStopId = endStop.stop_id;
    await ride.save();

    return verified;
}

/**
 * Finds the single nearest Stop from our DB within ~50-100 meters.
 */
async function findNearestStop(lat, lng) {
    if (!lat || !lng) return null;

    const allStops = await Stop.find({}); // Potentially optimize with geo queries

    let minDist = Infinity;
    let nearest = null;

    for (const stop of allStops) {
        const dist = haversineDistance(lat, lng, stop.stop_lat, stop.stop_lon);
        if (dist < minDist) {
            minDist = dist;
            nearest = stop;
        }
    }

    // We'll say if it's >100 meters, treat it as null
    if (minDist > 100) return null; // user is too far from any stop
    return nearest;
}

/**
 * Checks if `userTime` is within ±5 minutes of a scheduled arrival/departure
 * for the given `route` and `stop_id`.
 *
 * If `context.afterStopId` is provided, we can ensure the
 * stop_sequence is greater than that of the boarding stop, etc.
 */
async function isTimeMatch(stop_id, route, userTime, context = {}) {
    if (!stop_id || !userTime) return false;

    const allStopTimes = await StopTime.find({
        stop_id,
        route_short_name: route
        // optionally also match service_id if needed for day-of-week
    });

    // if we want to handle the "afterStopId" logic:
    let boardingStopSequence = null;
    if (context.afterStopId) {
        // find the stop_time for context.afterStopId to get its stop_sequence
        const boardStopTime = await StopTime.findOne({
            stop_id: context.afterStopId,
            route_short_name: route
        });
        if (boardStopTime) boardingStopSequence = boardStopTime.stop_sequence;
    }

    // Convert userTime to minutes since midnight (for comparison)
    const userMinutes = getMinutesSinceMidnight(userTime);

    for (const st of allStopTimes) {
        // If we need to ensure stop_sequence is after the boarding stop
        if (boardingStopSequence !== null && st.stop_sequence <= boardingStopSequence) {
            continue; // skip because it's not after the board stop
        }

        // parse e.g. "11:05:00" -> in minutes
        const arrivalMins = parseTimeToMins(st.arrival_time);
        const diff = Math.abs(userMinutes - arrivalMins);

        // if within ±5 minutes, consider it valid
        if (diff <= 5) {
            return true;
        }
    }

    return false;
}

/**
 * Haversine distance in meters.
 * (Basic version; in real code, you'd handle edge cases more thoroughly.)
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const toRad = (val) => (val * Math.PI) / 180;

    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c;
    return dist; // in meters
}

/**
 * Convert "HH:MM:SS" to an integer representing minutes after midnight.
 * e.g. "11:05:00" -> 665
 */
function parseTimeToMins(timeStr) {
    const [hh, mm, ss] = timeStr.split(':').map(Number);
    return hh * 60 + mm;
}

/**
 * Convert a Date (like userTime) to minutes after midnight local time.
 * For hackathon: we ignore date/timezone complexities.
 */
function getMinutesSinceMidnight(dateObj) {
    const d = new Date(dateObj);
    const hh = d.getHours();
    const mm = d.getMinutes();
    return hh * 60 + mm;
}
