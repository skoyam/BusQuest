import dbConnect from '../../lib/dbConnect';
import { boardRide, deboardRide } from '../../services/rideService';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const { userId, startLat, startLng, startTime } = req.body;
            const result = await boardRide(userId, startLat, startLng, startTime);

            return res.status(201).json(result);
        } catch (error) {
            console.error('API Error:', error);
            return res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }

    if (req.method === 'PATCH') {
        try {
            const { rideId, endLat, endLng, endTime } = req.body;
            const result = await deboardRide(rideId, endLat, endLng, endTime);

            if (!result.success) {
                return res.status(400).json({ error: result.message });
            }

            return res.status(200).json({ verified: true, message: result.message, points: result.points });
        } catch (error) {
            console.error('API Error:', error);
            return res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
}
