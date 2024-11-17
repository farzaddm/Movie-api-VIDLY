const mongoose = require("mongoose");
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
      winston.info(`Database connected to ${db}...`);

      // Only initialize Fawn if not in a test environment
      if (process.env.NODE_ENV !== "test") {
        const Fawn = require("fawn");
        Fawn.init(mongoose);
      }
    });
};
