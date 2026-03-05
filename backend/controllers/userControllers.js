const User = require("../models/userSchema.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const Register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res
        .status(401)
        .json({ message: "Please fill all the fields", success: false });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(401)
        .json({ message: "User already exists", success: false });
    }

    const hasedPassword = await bcrypt.hash(password, 16);

    const newuser = await User.create({
      name,
      username,
      email,
      password: hasedPassword,
    });

    return res
      .status(201)
      .json({ message: "User created successfully", newuser, success: true });
  } catch (err) {
    console.log(err);
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(401)
        .json({ message: "Please fill all the fields", success: false });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Incorrect email or password", success: false });
    }

    const tokenData = { userId: user._id };

    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });

    return res
      .status(201)
      .cookie("token", token, { expiresIn: "1d", httpOnly: true })
      .json({
        message: `Welcome back ${user.name}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

const Logout = async (req, res) => {
  return res
    .cookie("token", "", { expiresIn: new Date(Date.now()), httpOnly: true })
    .json({ message: "Logged out successfully", success: true });
};

const Bookmarks = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const tweetId = req.params.id;

    const user = await User.findById(loggedInUserId);

    if (user.bookmarks.includes(tweetId)) {
      await User.findByIdAndUpdate(loggedInUserId, {
        $pull: { bookmarks: tweetId },
      });
      return res
        .status(201)
        .json({ message: "Removed from bookmarks", success: true });
    } else {
      await User.findByIdAndUpdate(loggedInUserId, {
        $push: { bookmarks: tweetId },
      });
      return res
        .status(201)
        .json({ message: "Saved to bookmarks", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};

const getProfile = async (req, res) => {
  console.log(req.params.id);
  try {
    const id = req.params.id;
    const user = await User.findById(id).select("-password");
    return res.status(201).json({ user, success: true });
  } catch (error) {
    console.log(error);
  }
};

const otherUsers = async (req, res) => {
  try {
    const userid = req.params.id;
    const allotherUser = await User.find({ _id: { $ne: userid } }).select(
      "-password"
    );
    return res.status(201).json({ allotherUser, success: true });
  } catch (error) {
    console.log(error);
  }
};

const follow = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const userId = req.params.id;
    const loggedInUser = await User.findById(loggedInUserId);
    const user = await User.findById(userId);
    if (!user.followers.includes(loggedInUserId)) {
      await user.updateOne({ $push: { followers: loggedInUserId } });
      await loggedInUser.updateOne({ $push: { following: userId } });
    } else {
      return res.status(201).json({
        message: `User already followed to ${user.name}`,
        success: true,
      });
    }
    return res.status(201).json({
      message: `${loggedInUser.name} followed to ${user.name}`,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const unfollow = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const userId = req.params.id;
    const loggedInUser = await User.findById(loggedInUserId);
    const user = await User.findById(userId);
    if (loggedInUser.following.includes(userId)) {
      await user.updateOne({ $pull: { followers: loggedInUserId } });
      await loggedInUser.updateOne({ $pull: { following: userId } });
    } else {
      return res.status(400).json({
        message: "User has not followed yet",
        success: true,
      });
    }
    return res.status(201).json({
      message: `${loggedInUser.name} unfollow to ${user.name}`,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  Register,
  Login,
  Logout,
  Bookmarks,
  getProfile,
  otherUsers,
  follow,
  unfollow,
};
