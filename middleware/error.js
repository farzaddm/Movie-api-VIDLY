const logger = require("../models/logger");

module.exports = function (err, req, res, next) {
  logger.error(err.message, { metadata: { stack: err.stack, name: err.name } });
  res.status(500).send("Something failed");
};
