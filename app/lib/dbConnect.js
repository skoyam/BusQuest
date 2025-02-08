import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI; // from .env.local

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI in .env.local');
}

/**
 * Use a global variable to store the cached connection
 * so we don't create multiple connections in dev mode.
 */
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;
