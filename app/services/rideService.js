// app/services/rideService.js

import dbConnect from "@/lib/dbConnect";
import Ride from "@/models/Ride";
import User from "@/models/User";

/**
 * Create a new ride.
 * @param {Object} rideData - { userId, startTime, endTime, pointsEarned, ... }
 * @returns {Promise<Object>} - The created ride document.
 */
export async function createRide(rideData) {
    await dbConnect();
    const newRide = await Ride.create(rideData);
    return newRide;
}

/**
 * Retrieve all rides (for debugging or admin usage).
 * @returns {Promise<Array>} - Array of ride documents.
 */
export async function getAllRides() {
    await dbConnect();
    return Ride.find({});
}

/**
 * Get rides for a specific user.
 * @param {String} userId - The ID of the user.
 * @returns {Promise<Array>} - Array of ride documents for that user.
 */
export async function getRidesByUserId(userId) {
    await dbConnect();
    return Ride.find({ userId });
}

/**
 * Logic to create a ride and conditionally award points if off-peak.
 * @param {Object} rideData - { userId, startTime, endTime, etc. }
 * @returns {Promise<Object>} - The created or updated ride document.
 */
export async function createRideAndAwardPoints(rideData) {
    await dbConnect();
    // Create the ride first
    let newRide = await Ride.create(rideData);

    // Determine if it's off-peak (dummy example: if startTime between 11:00-15:00)
    const startHour = new Date(rideData.startTime).getHours();
    const isOffPeak = startHour >= 11 && startHour < 15;

    if (isOffPeak) {
        newRide.pointsEarned = 100;
        await newRide.save();

        // Also update user points
        await User.findByIdAndUpdate(
            rideData.userId,
            { $inc: { points: 100 } },
            { new: true }
        );
    }

    return newRide;
}
