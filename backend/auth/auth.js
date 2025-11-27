const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_THIS_SECRET";

/**
 * Express middleware: reads Authorization header and sets req.user if valid
 */
function attachUserFromHeader(req, res, next) {
  const auth = req.headers.authorization || "";
  if (auth.startsWith("Bearer ")) {
    const token = auth.slice(7);
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (e) {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
}

/**
 * checkAuth: used inside resolvers to enforce role-based access
 */
function checkAuth(user, roles = []) {
  if (!user) throw new Error("Unauthorized");
  if (roles.length > 0 && !roles.includes(user.role))
    throw new Error("Forbidden");
}

module.exports = { attachUserFromHeader, checkAuth };
