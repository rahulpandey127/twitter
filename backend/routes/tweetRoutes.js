const express = require("express");

const router = express.Router();

const {
  createTweet,
  deletTweet,
  LikeOrDislike,
  getAllTweets,
  getAllFollowingTweets,
} = require("../controllers/tweetController");
const isAuthenticated = require("../config/auth");

router.route("/createtweet").post(isAuthenticated, createTweet);
router.route("/deletetweet/:id").delete(isAuthenticated, deletTweet);
router.route("/liketweet/:id").put(isAuthenticated, LikeOrDislike);
router.route("/alltweets/:id").get(isAuthenticated, getAllTweets);
router
  .route("/followingtweets/:id")
  .get(isAuthenticated, getAllFollowingTweets);

module.exports = router;
