import dbConnect from '@/lib/dbConnect';
import Ride from '@/models/Ride';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await dbConnect();
            const { userId, route, boardLat, boardLng } = req.body;

            const newRide = await Ride.create({
                userId,
                route,
                boardTime: new Date(), // current time or client-supplied time
                boardLat,
                boardLng,
            });

            return res.status(201).json(newRide);
        } catch (error) {
            console.error('Error in POST /api/rides:', error);
            return res.status(400).json({ error: 'Failed to create ride' });
        }
    }

    // For GET or other methods, handle accordingly or return 405
    return res.status(405).end();
}
