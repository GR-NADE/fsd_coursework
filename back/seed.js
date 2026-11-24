import { connectDB, closeDB } from "./db.js";

const lessons = [
    { subject: "Full-stack Development", teacher: "Haardik Gautam", location: "Mauritius", price: 180, availability: 5, image: "fsd-bk.jpg" },
    { subject: "Database Systems", teacher: "Haardik Gautam", location: "Mauritius", price: 160, availability: 5, image: "db-bk.jpg" },
    { subject: "Strategic Information Systems", teacher: "Jessen Aurmoogum", location: "Mauritius", price: 170, availability: 5, image: "sis-bk.jpg" },
    { subject: "Project Management", teacher: "Jessen Aurmoogum", location: "Mauritius", price: 150, availability: 5, image: "pm-bk.jpg" },
    { subject: "French for Beginners", teacher: "Amara Okafor", location: "Nigeria", price: 140, availability: 5, image: "fra-bk.jpg" },
    { subject: "World History", teacher: "Amara Okafor", location: "Nigeria", price: 140, availability: 5, image: "wrld-hstr-bk.jpg" },
    { subject: "Statistics", teacher: "Priya Ramgoolam", location: "UK", price: 150, availability: 5, image: "stat-bk.jpg" },
    { subject: "Biology", teacher: "Priya Ramgoolam", location: "UK", price: 160, availability: 5, image: "bio-bk.jpg" },
    { subject: "Creative Writing", teacher: "Oliver Bennett", location: "UK", price: 120, availability: 5, image: "crtv-wrt-bk.jpg" },
    { subject: "Digital Photography", teacher: "Oliver Bennett", location: "UK", price: 125, availability: 5, image: "photo-bk.jpg" },
];

const teacherNames = [...new Set(lessons.map((lesson) => lesson.teacher))];

const teachers = teacherNames.map((name) => ({
    name,
    lessons: lessons.filter((lesson) => lesson.teacher === name).map((lesson) => lesson.subject),
}));

const db = await connectDB();

await db.collection("teachers").deleteMany({});
await db.collection("lessons").deleteMany({});

await db.collection("teachers").insertMany(teachers);
await db.collection("lessons").insertMany(lessons);

console.log(`Seeded ${teachers.length} teachers and ${lessons.length} lessons`);

await closeDB();