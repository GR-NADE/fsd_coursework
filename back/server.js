import express from "express";
import cors from "cors";
import { ObjectId } from "mongodb";
import { connectDB } from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

const db = await connectDB();
console.log("Database connected");

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Lessons API is running");
});

app.get("/lessons", async (req, res) => {
    const lessons = await db.collection("lessons").find().toArray();
    res.json(lessons);
});

app.post("/orders", async (req, res) => {
    const { name, phone, lessons } = req.body;

    if (!name || !phone || !lessons)
    {
        return res.status(400).json({ error: "name, phone and lessons array are required" });
    }

    const order = { name, phone, lessons, createdAt: new Date() };
    const result = await db.collection("orders").insertOne(order);

    res.status(201).json({
        message: "Order saved",
        orderId: result.insertedId
    });
});

app.put("/lessons/:id", async (req, res) => {
    const result = await db.collection("lessons").updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });

    if (result.matchedCount === 0)
    {
        return res.status(404).json({ error: "Lesson not found" });
    }

    res.json({ message: "Lesson updated" })
});

app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});