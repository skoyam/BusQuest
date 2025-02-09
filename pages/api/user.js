import { getAuth } from "@clerk/nextjs/server";
import dbConnect from "../../lib/dbConnect";
import User from "../../models/User";

export default async function handler(req, res) {
    await dbConnect();

    // Get Clerk auth data
    const { userId } = getAuth(req);

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized - Clerk session not found" });
    }

    if (req.method === "GET") {
        try {
            const user = await User.findOne({ clerkUserId: userId });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(200).json({ success: true, user });
        } catch (error) {
            return res.status(500).json({ error: "Server error", details: error.message });
        }
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}
