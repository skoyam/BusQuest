import dbConnect from "../lib/dbConnect";
import User from "../models/User";
import Reward from "../models/Reward";

/**
 * Create a new user document.
 * @param {Object} userData - { username, points, collectibles, etc. }
 * @returns {Promise<Object>} - The created user object.
 */
export async function createUser(userData) {
    await dbConnect();
    return User.create(userData);
}

/**
 * Retrieve a user by ID.
 * @param {String} userId - The ID of the user.
 * @returns {Promise<Object | null>} - The user object if found, else null.
 */
export async function getUserById(userId) {
    await dbConnect();
    return User.findById(userId);
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
        { new: true } // Returns the updated doc
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

/**
 * Check if user is eligible for ride rewards.
 * @param {String} userId - The user ID.
 * @returns {Promise<Boolean>} - True if eligible, false if user recently received rewards.
 */
export async function isEligibleForRideRewards(userId) {
    await dbConnect();
    const user = await User.findById(userId);

    if (!user) return false;

    const lastRideTime = user.lastRideTime || null;
    const now = new Date();

    // Minimum interval between rewards (e.g., 30 minutes)
    const minInterval = 30 * 60 * 1000;

    if (lastRideTime && (now - lastRideTime < minInterval)) {
        return false; // Prevent excessive farming
    }

    // Update last ride time
    await User.findByIdAndUpdate(userId, { lastRideTime: now });
    return true;
}

/**
 * Award a reward to a user.
 * @param {String} userId - The user ID.
 * @param {String} rewardId - The reward ID.
 * @returns {Promise<Object | null>} - Updated user object or null if user not found.
 */
export async function awardUserReward(userId, rewardId) {
    await dbConnect();

    const user = await User.findById(userId);
    if (!user) return null;

    const reward = await Reward.findById(rewardId);
    if (!reward) {
        throw new Error("Invalid reward ID");
    }

    // Add reward details directly to user
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            $push: {
                rewards: {
                    name: reward.name,
                    code: reward.code,
                    claimedAt: new Date()
                }
            }
        },
        { new: true }
    );

    return updatedUser;
}

/**
 * Get the leaderboard (top users by points).
 * @param {Number} limit - The number of top users to fetch.
 * @returns {Promise<Array>} - Array of top users sorted by points.
 */
export async function getLeaderboard(limit = 10) {
    await dbConnect();
    return User.find({})
        .sort({ points: -1 }) // Sort descending
        .limit(limit)
        .select("username points"); // Return only relevant fields
}
