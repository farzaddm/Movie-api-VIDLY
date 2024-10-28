const winston = require("winston");
require("winston-mongodb");

const logger = winston.createLogger({
  level: "error",
  transports: [
    new winston.transports.File({ filename: "logfile.log" }),
    new winston.transports.MongoDB({
      db: "mongodb://localhost:27017/MoshTut",
      collection: "logs",
      level: "error",
    }),
  ],
});

module.exports = logger;
