import dbConnect from '@/lib/dbConnect';
import Ride from '@/models/Ride';
import { verifyRide } from '@/services/verificationService'; // We'll create this below

export default async function handler(req, res) {
    await dbConnect();

    const { rideId } = req.query;

    if (req.method === 'PATCH') {
        try {
            const { endLat, endLng } = req.body;

            // 1. Update the ride with endTime, lat/lng
            let ride = await Ride.findByIdAndUpdate(
                rideId,
                {
                    endTime: new Date(),
                    endLat,
                    endLng
                },
                { new: true }
            );

            // 2. Verify the ride (compare with GTFS data)
            const isVerified = await verifyRide(ride._id);

            // 3. Return updated ride
            ride = await Ride.findById(ride._id); // refetch to get updated 'verified' field
            return res.status(200).json(ride);

        } catch (error) {
            console.error('Error in PATCH /api/rides/[rideId]:', error);
            return res.status(400).json({ error: 'Failed to update ride' });
        }
    }

    // For GET or other methods:
    return res.status(405).end();
}
