import dbConnect from '../../lib/dbConnect';
import Ride from '../../models/Ride';

export default async function handler(req, res) {
    try {
        await dbConnect();

        if (req.method !== 'PATCH') {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }

        const { rideId, lat, lng } = req.body;

        if (!rideId || !lat || !lng) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ error: 'Ride not found' });
        }

        // Append new GPS data
        ride.gpsData.push({ lat, lng, timestamp: new Date() });
        await ride.save();

        return res.status(200).json({ success: true, message: 'Location updated' });
    } catch (error) {
        console.error('❌ API Error:', error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
