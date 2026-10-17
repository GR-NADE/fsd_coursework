import express from "express";
import { connectDB } from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

const db = await connectDB();
console.log("Database connected");

app.get("/", (req, res) => {
    res.send("Lessons API is running");
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});