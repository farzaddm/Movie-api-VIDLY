const express = require("express");
const winston = require("winston");

const PORT = process.env.PORT || 3000;

const app = express();

require("./startup/login")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
require('./startup/prod')(app);

const server = app.listen(3000, () => winston.info(`server is running on random port...`));

module.exports = server;