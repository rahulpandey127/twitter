const Tweet = require("../models/tweetSchema");
const User = require("../models/userSchema");

const createTweet = async (req, res) => {
  try {
    const { description, id } = req.body;
    if (!description || !id) {
      return res
        .status(401)
        .json({ message: "All fields are required", succcess: "false" });
    }

    const user = await User.findById(id).select("-password");
    const tweet = await Tweet.create({
      description,
      userId: id,
      userDetails: user,
    });
    return res
      .status(201)
      .json({ message: "Tweet created successfully", tweet, success: true });
  } catch (error) {
    console.log(error);
  }
};

const deletTweet = async (req, res) => {
  try {
    const { id } = req.params;
    const tweet = await Tweet.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ message: "Tweet deleted successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};

const LikeOrDislike = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const tweetId = req.params.id;
    const tweet = await Tweet.findById(tweetId);
    console.log(tweet);
    if (tweet.like.includes(loggedInUserId)) {
      await Tweet.findByIdAndUpdate(tweetId, {
        $pull: { like: loggedInUserId },
      });
      return res.status(200).json({ message: "Tweet disliked", success: true });
    } else {
      await Tweet.findByIdAndUpdate(tweetId, {
        $push: { like: loggedInUserId },
      });
      return res.status(200).json({ message: "Tweet liked", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};

const getAllTweets = async (req, res) => {
  try {
    const id = req.params.id;
    const loggedInUser = await User.findById(id);
    const loggedInUserTweets = await Tweet.find({ userId: id });
    const followingUserTweets = await Promise.all(
      loggedInUser.following.map((otherUsersId) => {
        return Tweet.find({ userId: otherUsersId });
      })
    );
    return res.status(200).json({
      message: "All tweets",
      tweets: loggedInUserTweets.concat(...followingUserTweets),
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllFollowingTweets = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const loggedInUser = await User.findById(id);
    const followingUserTweets = await Promise.all(
      loggedInUser.following.map((otherUsersId) => {
        return Tweet.find({ userId: otherUsersId });
      })
    );
    return res.status(200).json({
      message: "All tweets",
      tweets: [].concat(...followingUserTweets),
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createTweet,
  deletTweet,
  LikeOrDislike,
  getAllTweets,
  getAllFollowingTweets,
};
