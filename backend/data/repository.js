const fs = require("fs").promises;
const path = require("path");

const DATA_PATH = path.resolve(__dirname, "..", "data", "employees.json");

async function ensureFile() {
  try {
    await fs.access(DATA_PATH);
  } catch (e) {
    // create directory & file with empty array
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.writeFile(DATA_PATH, "[]", "utf8");
  }
}

async function readAll() {
  await ensureFile();
  const raw = await fs.readFile(DATA_PATH, "utf8");
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

async function writeAll(data) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf8");
}

module.exports = { readAll, writeAll };
