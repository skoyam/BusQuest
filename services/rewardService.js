// app/services/rewardService.js

import dbConnect from "../lib/dbConnect";
import Reward from "../models/Reward";

/**
 * Create a new reward.
 * @param {Object} rewardData - { name, description, code, etc. }
 * @returns {Promise<Object>} - The created reward document.
 */
export async function createReward(rewardData) {
    await dbConnect();
    const newReward = await Reward.create(rewardData);
    return newReward;
}

/**
 * Retrieve a reward by ID.
 * @param {String} rewardId - The ID of the reward.
 * @returns {Promise<Object | null>} - The reward object or null if not found.
 */
export async function getRewardById(rewardId) {
    await dbConnect();
    const reward = await Reward.findById(rewardId);
    return reward;
}

/**
 * Get all rewards.
 * @returns {Promise<Array>} - Array of all reward documents.
 */
export async function getAllRewards() {
    await dbConnect();
    return Reward.find({});
}
