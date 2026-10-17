import "dotenv/config";
import dns from "node:dns";
import { MongoClient } from "mongodb";

// this is just for testing/development phase
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectDB() {
    await client.connect();
    return client.db("lessonsApp");
}

export async function closeDB() {
    await client.close();
}