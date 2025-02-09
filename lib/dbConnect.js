// dbConnect.js (Database Connection)
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/busquest";
if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI in .env.local');
}
let cached = global.mongoose || { conn: null, promise: null };

async function dbConnect() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(mongoose => mongoose);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
module.exports = dbConnect;