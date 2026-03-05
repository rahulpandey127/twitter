const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const databaseconnection = () => {
  mongoose
    .connect(process.env.MongoUri)
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = databaseconnection;
