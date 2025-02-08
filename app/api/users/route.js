import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET(req) {
    try {
        await dbConnect();
        const users = await User.find({});
        return new Response(JSON.stringify(users), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json(); // { username, maybe password, etc. }
        const newUser = await User.create(body);
        return new Response(JSON.stringify(newUser), { status: 201 });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Invalid data' }), { status: 400 });
    }
}
