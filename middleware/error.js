const winston = require("winston");

module.exports = function (err, req, res, next) {
  winston.error(err.message, { metadata: { stack: err.stack, name: err.name } });
  res.status(500).send("Something failed");
};
