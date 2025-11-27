const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_THIS_SECRET";

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

async function login(username, password) {
  const u = users.find((x) => x.username === username);
  if (!u) throw new Error("Invalid credentials");
  const ok = bcrypt.compareSync(password, u.passwordHash);
  if (!ok) throw new Error("Invalid credentials");
  const token = jwt.sign({ username: u.username, role: u.role }, JWT_SECRET, {
    expiresIn: "8h",
  });
  return token;
}

module.exports = { login, users };
