import mongoose from 'mongoose';

const RewardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    // Some code or reference for redemption?
    code: String,
    // Track who redeemed it, or how many times
}, { timestamps: true });

export default mongoose.models.Reward || mongoose.model('Reward', RewardSchema);
