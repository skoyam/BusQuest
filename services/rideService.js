import mongoose from 'mongoose';
import Ride from '../models/Ride.js';
import User from '../models/User.js';
import dbConnect from '../lib/dbConnect.js';
import { verifyRide } from './verificationService.js';
import { awardUserReward } from './userService.js';
import { isWithinRewardHours } from './timeService.js';

export async function boardRide(userId, startLat, startLng, startTime) {
    await dbConnect();

    console.log(`Boarding ride for user: ${userId}`);

    const ride = await Ride.create({
        userId,
        startLat: parseFloat(startLat.toFixed(9)), // Maintain precision
        startLng: parseFloat(startLng.toFixed(9)),
        startTime: new Date(startTime), // Ensure correct time storage
        verified: false,
        pointsEarned: 0
    });

    console.log(`Ride started at: (${ride.startLat}, ${ride.startLng}) at ${ride.startTime}`);
    return { success: true, message: 'Ride started successfully', ride };
}

export async function deboardRide(rideId, endLat, endLng, endTime) {
    await dbConnect();
    console.log(`Deboarding ride: ${rideId}`);

    const ride = await Ride.findById(rideId);
    if (!ride) return { success: false, message: "Ride not found" };

    // Store end location and time
    ride.endLat = parseFloat(endLat.toFixed(9));
    ride.endLng = parseFloat(endLng.toFixed(9));
    ride.endTime = new Date(endTime);
    await ride.save();

    console.log(`Updated ride end location: (${ride.endLat}, ${ride.endLng})`);

    // Verify ride validity
    const isValid = await verifyRide(ride);
    if (!isValid) return { success: false, message: "Ride verification failed" };

    // Ensure ride is between 11 AM - 3 PM EST
    if (!isWithinRewardHours(ride.startTime)) {
        console.error("Ride is outside reward hours");
        return { success: false, message: "Ride outside reward hours" };
    }

    // Ensure deboarded at a different stop or same stop after 5 minutes
    const minTimeGap = 5 * 60 * 1000; // 5 minutes
    const sameStop = ride.startLat === ride.endLat && ride.startLng === ride.endLng;
    const timeDiff = ride.endTime - ride.startTime;

    if (sameStop && timeDiff < minTimeGap) {
        console.error("User deboarded too soon at the same stop");
        return { success: false, message: "User must wait or travel to a different stop" };
    }

    // Award 100 points
    const pointsAwarded = 100;
    console.log(`Awarding ${pointsAwarded} points to user ${ride.userId}`);

    const updatedUser = await User.findByIdAndUpdate(
        ride.userId,
        { $inc: { points: pointsAwarded } },
        { new: true }
    );

    if (!updatedUser) {
        console.error("Failed to update user points");
        return { success: false, message: "Failed to update user points" };
    }

    console.log(`User now has ${updatedUser.points} points`);

    ride.pointsEarned = pointsAwarded;
    await ride.save();

    return {
        success: true,
        message: "Ride verified and points awarded",
        points: updatedUser.points,
    };
}
