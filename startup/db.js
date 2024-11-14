const mongoose = require("mongoose");
const Fawn = require("fawn");
const winston = require("winston");
const config = require("config");

module.exports = function () {
  const db = config.get("db");
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => {
      winston.info(`Database connecting to ${db}...`);
      // Initialize Fawn with mongoose connection
      Fawn.init(mongoose);
    })
};
