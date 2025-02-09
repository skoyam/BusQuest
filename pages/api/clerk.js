import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    try {
        const { clerkId, email, name, profileImage, password } = req.body;

        if (!clerkId || !email) {
            return res.status(400).json({ success: false, message: 'Missing Clerk ID or email' });
        }

        let user = await User.findOne({ clerkId });

        if (!user) {
            let hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

            user = await User.create({
                clerkId,
                email,
                name,
                profileImage,
                password: hashedPassword,
                points: 0,
                collectibles: [],
                rewards: []
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User authenticated successfully',
            user
        });

    } catch (error) {
        console.error('Error authenticating user:', error);
        return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
}
