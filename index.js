const express = require("express");
const winston = require("winston");

const PORT = process.env.PORT || 3000;

const app = express();

require("./startup/login")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

const server = app.listen(0, () => winston.info(`server is running on random port...`));

module.exports = server;