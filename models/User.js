import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    clerkUserId: { type: String, required: true, unique: true }, // Clerk's unique ID
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    points: { type: Number, default: 0 },
    rewards: [{ type: String }], // Store reward IDs or names
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
