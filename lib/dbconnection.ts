import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

// If env variable missing throw erre
if (!MONGODB_URI) {
    throw new Error("❌ Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = global.mongoose;

// if not connect so connection and promise null in cached
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
    if (cached.conn) return cached.conn; // if already connect return that connection

    // if promise not resolved
    if (!cached.promise) {
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10, // ek waqt mai max 10 connections
        };
        // connect database connection in promise
        cached.promise = mongoose
            .connect(MONGODB_URI, opts)
            .then(() => mongoose.connection);
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null; // ❌ error pe reset
        throw error;
    }

    return cached.conn;
}
