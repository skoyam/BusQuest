import dbConnect from '@/lib/dbConnect';
import Reward from '@/models/Reward';

export async function GET() {
    await dbConnect();
    const rewards = await Reward.find({});
    return new Response(JSON.stringify(rewards), { status: 200 });
}

export async function POST(req) {
    await dbConnect();
    const body = await req.json(); // { name, description, code, etc. }
    const newReward = await Reward.create(body);
    return new Response(JSON.stringify(newReward), { status: 201 });
}
