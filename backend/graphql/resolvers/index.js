const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_THIS_SECRET";

// Demo users (hashed passwords)
const users = [
  {
    id: "u1",
    username: "admin",
    passwordHash: bcrypt.hashSync("adminpass", 8),
    role: "ADMIN",
  },
  {
    id: "u2",
    username: "employee",
    passwordHash: bcrypt.hashSync("employeepass", 8),
    role: "EMPLOYEE",
  },
];

function dataFilePath() {
  return path.resolve(__dirname, "data", "employees.json");
}

function readData() {
  const p = dataFilePath();
  if (!fs.existsSync(p)) return [];
  const raw = fs.readFileSync(p, "utf8");
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function writeData(data) {
  const p = dataFilePath();
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

function checkAuth(user, roles = []) {
  if (!user) throw new Error("Unauthorized");
  if (roles.length > 0 && !roles.includes(user.role))
    throw new Error("Forbidden");
}

module.exports = {
  Query: {
    listEmployees: (
      _,
      {
        filter = {},
        page = 1,
        pageSize = 10,
        sortBy = "name",
        sortDir = "asc",
      },
      context
    ) => {
      // Defensive: ensure filter is an object
      filter = filter || {};

      let data = readData();

      // Filtering (safe checks)
      if (filter.nameContains) {
        const q = filter.nameContains.toLowerCase();
        data = data.filter((e) => e.name && e.name.toLowerCase().includes(q));
      }
      if (typeof filter.minAge === "number")
        data = data.filter(
          (e) => typeof e.age === "number" && e.age >= filter.minAge
        );
      if (typeof filter.maxAge === "number")
        data = data.filter(
          (e) => typeof e.age === "number" && e.age <= filter.maxAge
        );
      if (filter.classEquals)
        data = data.filter((e) => e.class === filter.classEquals);
      if (typeof filter.flagged === "boolean")
        data = data.filter((e) => e.flagged === filter.flagged);

      // Sorting
      data.sort((a, b) => {
        const A = a[sortBy];
        const B = b[sortBy];
        if (A == null) return 1;
        if (B == null) return -1;
        if (typeof A === "string") {
          return sortDir === "asc" ? A.localeCompare(B) : B.localeCompare(A);
        }
        return sortDir === "asc" ? A - B : B - A;
      });

      const total = data.length;
      const start = (page - 1) * pageSize;
      const items = data.slice(start, start + pageSize);
      return { items, total, page, pageSize };
    },

    getEmployee: (_, { id }, context) => {
      const data = readData();
      return data.find((e) => e.id === id) || null;
    },

    me: (_, __, { user }) => {
      return user ? `${user.username} (${user.role})` : null;
    },
  },

  Mutation: {
    addEmployee: (_, { input }, { user }) => {
      checkAuth(user, ["ADMIN"]);
      const data = readData();
      const newEmp = { id: uuidv4(), ...input };
      data.push(newEmp);
      writeData(data);
      return newEmp;
    },
    updateEmployee: (_, { id, input }, { user }) => {
      const data = readData();
      const idx = data.findIndex((e) => e.id === id);
      if (idx === -1) throw new Error("Not found");
      if (!user) throw new Error("Unauthorized");
      if (user.role !== "ADMIN") {
        const allowed = {};
        if (input.flagged !== undefined) allowed.flagged = input.flagged;
        if (input.attendance !== undefined)
          allowed.attendance = input.attendance;
        data[idx] = { ...data[idx], ...allowed };
      } else {
        data[idx] = { ...data[idx], ...input };
      }
      writeData(data);
      return data[idx];
    },
    deleteEmployee: (_, { id }, { user }) => {
      checkAuth(user, ["ADMIN"]);
      let data = readData();
      const before = data.length;
      data = data.filter((e) => e.id !== id);
      writeData(data);
      return data.length < before;
    },
    login: (_, { username, password }) => {
      const u = users.find((x) => x.username === username);
      if (!u) throw new Error("Invalid credentials");
      const ok = bcrypt.compareSync(password, u.passwordHash);
      if (!ok) throw new Error("Invalid credentials");
      const token = jwt.sign(
        { username: u.username, role: u.role },
        JWT_SECRET,
        { expiresIn: "8h" }
      );
      return token;
    },
  },
};
