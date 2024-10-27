// packages
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const morgan = require("morgan");
const debug = require("debug")("index:startup");
const mongoose = require("mongoose");
const Fawn = require("fawn");
require('dotenv').config();
const config = require("config");

// routers
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const home = require("./routes/home");
// =================================================================

const app = express();
const port = process.env.PORT || 3000;

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost:27017/MoshTut", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    debug("Database connecting to mongoDB...");
    // Initialize Fawn with mongoose connection
    Fawn.init(mongoose);
  })
  .catch((err) => debug("Could not connect to mongoDB..."));

app.set("view engine", "pug");

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set routers
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

app.use("/", home);

// check env.NODE_ENV to see if we are development or not
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug("Morgan enabled...");
}

app.listen(port, () => console.log(`server is running on ${port}...`));
