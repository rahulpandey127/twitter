const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const isAuthenticated = (req, res, next) => {
  console.log("isAuthenticated");
  try {
    const token = req.cookies.token;
    console.log(token);
    if (!token) {
      return res
        .status(401)
        .json({ message: "User not authenticated", success: false });
    }
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(verified);
    next();
  } catch (err) {
    console.log(err);
  }
};

module.exports = isAuthenticated;
