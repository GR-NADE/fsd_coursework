import { connectDB, closeDB } from "./db.js";

const teachers = [
    { name: "Haardik Gautam", subject: "Full-stack Development", code: "CST3144" },
    { name: "Jessen Aurmoogum", subject: "Strategic Information Systems", code: "CST3310" },
];

const weekPrices = [
    {week: 1, price: 120},
    {week: 2, price: 125},
    {week: 3, price: 140},
    {week: 4, price: 160},
    {week: 5, price: 180},
];

const lessons = teachers.flatMap(({ name, subject, code }) =>
    weekPrices.map(({ week, price }) => ({
        subject,
        lesson: `${code} Week ${week} Lab`,
        price,
        availability: 15,
        teacher: name,
    }))
);

const db = await connectDB();

await db.collection("teachers").deleteMany({});
await db.collection("lessons").deleteMany({});

await db.collection("teachers").insertMany(
    teachers.map(({ name, subject }) => ({ name, subject }))
);
await db.collection("lessons").insertMany(lessons);

console.log(`Seeded ${teachers.length} teachers and ${lessons.length} lessons`);

await closeDB();