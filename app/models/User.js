import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    // If you store a password or passcode, do so securely (hash, etc.), or skip if not needed
    points: { type: Number, default: 0 },
    // Example: store collectibles as an array of strings or object references
    collectibles: [{ type: String }],
    // Or you can store references to rides if you want:
    rides: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ride' }],

    rewards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reward' }],
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
