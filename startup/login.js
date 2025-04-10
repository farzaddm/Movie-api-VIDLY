const winston = require("winston");
// require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
  winston.exceptions.handle(
    new winston.transports.File({ filename: "../logs/uncaughtExceptions.log" }),
    new winston.transports.Console()
  );

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  winston.add(new winston.transports.File({ filename: "../logs/logfile.log" }));
  // winston.add(
  //   new winston.transports.MongoDB({
  //     db: "mongodb://localhost:27017/MoshTut",
  //     collection: "logs",
  //     level: "info",
  //   })
  // );
};
