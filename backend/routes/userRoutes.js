const express = require("express");
const router = express.Router();

const {
  Register,
  Login,
  Logout,
  Bookmarks,
  getProfile,
  otherUsers,
  follow,
  unfollow,
} = require("../controllers/userControllers");
const isAuthenticated = require("../config/auth");

router.post("/register", Register);
router.post("/login", Login);
router.get("/logout", Logout);
router.post("/bookmarks/:id", isAuthenticated, Bookmarks);
router.get("/profile/:id", isAuthenticated, getProfile);
router.get("/otherusers/:id", isAuthenticated, otherUsers);
router.post("/follow/:id", isAuthenticated, follow);
router.post("/unfollow/:id", isAuthenticated, unfollow);

module.exports = router;
