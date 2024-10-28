const mongoose = require("mongoose");
const Fawn = require("fawn");
const winston = require("winston");

module.exports = function () {
  mongoose
    .connect("mongodb://localhost:27017/MoshTut", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => {
      winston.info("Database connecting to mongoDB...");
      // Initialize Fawn with mongoose connection
      Fawn.init(mongoose);
    })
};
