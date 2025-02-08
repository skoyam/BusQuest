// app/services/userService.js

import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

/**
 * Create a new user document.
 * @param {Object} userData - { username, points, collectibles, etc. }
 * @returns {Promise<Object>} - The created user object.
 */
export async function createUser(userData) {
    await dbConnect();
    const newUser = await User.create(userData);
    return newUser;
}

/**
 * Retrieve a user by ID.
 * @param {String} userId - The ID of the user.
 * @returns {Promise<Object | null>} - The user object if found, else null.
 */
export async function getUserById(userId) {
    await dbConnect();
    const user = await User.findById(userId);
    return user;
}

/**
 * Retrieve all users (for debugging or admin).
 * @returns {Promise<Array>} - Array of user objects.
 */
export async function getAllUsers() {
    await dbConnect();
    return User.find({});
}

/**
 * Update a user's points (add or subtract).
 * @param {String} userId - The ID of the user.
 * @param {Number} pointsToAdd - Positive or negative number of points to add/subtract.
 * @returns {Promise<Object | null>} - The updated user object, or null if not found.
 */
export async function updateUserPoints(userId, pointsToAdd) {
    await dbConnect();
    return User.findByIdAndUpdate(
        userId,
        { $inc: { points: pointsToAdd } },
        { new: true } // returns the updated doc
    );
}

/**
 * Add a collectible to a user.
 * @param {String} userId - The user ID.
 * @param {String} collectible - The collectible identifier.
 */
export async function addCollectibleToUser(userId, collectible) {
    await dbConnect();
    return User.findByIdAndUpdate(
        userId,
        { $push: { collectibles: collectible } },
        { new: true }
    );
}

export async function awardUserReward(userId, rewardId) {
    // Option 1: If you store references
    const user = await User.findByIdAndUpdate(
        userId,
        { $push: { rewards: rewardId } },
        { new: true }
    );

    // Option 2: If you store name/code directly:
     const reward = await Reward.findById(rewardId);
     await User.findByIdAndUpdate(userId, {
       $push: { rewards: { name: reward.name, code: reward.code, claimedAt: new Date() } }
     }, { new: true });

    return user;
}