import dbConnect from '@/lib/dbConnect';
import Ride from '@/models/Ride';
import User from '@/models/User';

export async function GET() {
    try {
        await dbConnect();
        const rides = await Ride.find({});
        return new Response(JSON.stringify(rides), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch rides' }), { status: 500 });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json(); // { userId, startTime, endTime, ... }
        const newRide = await Ride.create(body);

        // Optionally update user points in real-time:
        // e.g. if the ride was off-peak, add 100 points:
        // (Add your own time checks for "11am–3pm" etc.)
        let addedPoints = 0;
        if (startHour >= 11 && startHour < 15) {
            addedPoints = 100;
            newRide.pointsEarned = 100;
            await newRide.save();

            await User.findByIdAndUpdate(body.userId, {
                $inc: { points: 100 }
            });
        }

        return new Response(JSON.stringify(newRide), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to create ride' }), { status: 400 });
    }
}
