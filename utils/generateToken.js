/* const jwt = require("jsonwebtoken");

const generateToken = (res, user) => {
  const role = user.isAdmin ? "admin" : "user";
  const token = jwt.sign({ userId: user._id, role }, process.env.JWT_SECRET, { expiresIn: "3d" });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  };

  res.cookie("jwt", token, cookieOptions);
};

module.exports = generateToken;
 */
const jwt = require("jsonwebtoken");

const generateToken = (res, user) => {
  const role = user.isAdmin ? "admin" : "user";

  const token = jwt.sign({ userId: user._id, role }, process.env.JWT_SECRET, { expiresIn: "3d" });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true in prod (https)
    sameSite: "lax", // ✅ best for subdomains
    domain: ".auknotes.com", // ✅ share across subdomains
    path: "/",
    maxAge: 3 * 24 * 60 * 60 * 1000, // ✅ match token (3 days)
  });
};

module.exports = generateToken;
