// backend/scripts/seed.js
const fs = require("fs");
const path = require("path");

const OUT = path.resolve(__dirname, "..", "data", "employees.json");

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const firstNames = [
  "James",
  "John",
  "Robert",
  "Michael",
  "William",
  "David",
  "Richard",
  "Joseph",
  "Thomas",
  "Charles",
  "Mary",
  "Patricia",
  "Jennifer",
  "Linda",
  "Elizabeth",
  "Barbara",
  "Susan",
  "Jessica",
  "Sarah",
  "Karen",
];
const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Jones",
  "Brown",
  "Davis",
  "Miller",
  "Wilson",
  "Moore",
  "Taylor",
  "Anderson",
  "Thomas",
  "Jackson",
  "White",
  "Harris",
  "Martin",
  "Thompson",
  "Garcia",
  "Martinez",
  "Robinson",
];

function rndName() {
  const a = firstNames[Math.floor(Math.random() * firstNames.length)];
  const b = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${a} ${b}`;
}

function rndSubjects(i) {
  return i % 2 === 0 ? ["Math", "Science"] : ["English", "History"];
}

const ITEMS = [];
for (let i = 0; i < 200; i++) {
  const id = Math.random().toString(16).slice(2, 8);
  const name = rndName();
  const age = randInt(20, 70);
  const cls = `Class ${1 + (i % 5)}`;
  const subjects = rndSubjects(i);
  const attendance =
    Math.round((60 + (i % 40) + Math.random() * 5) * 100) / 100;
  const flagged = i % 7 === 0;
  ITEMS.push({ id, name, age, class: cls, subjects, attendance, flagged });
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(ITEMS, null, 2), "utf8");
console.log(`Seeded ${ITEMS.length} employees to ${OUT}`);
