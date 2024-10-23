// packages
const express = require("express");
const morgan = require("morgan");
const debug = require("debug")("index:startup");
const mongoose = require("mongoose");

// routers
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const home = require("./routes/home");
// =================================================================

const app = express();
const port = process.env.PORT || 3000;

mongoose
  .connect("mongodb://localhost:27017/MoshTut")
  .then(() => debug("Database connecting to mongoDB..."))
  .catch(err => debug("Could not connect to mongoDB..."));

app.set("view engine", "pug");

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set routers
app.use("/api/genres", genres);
app.use("/api/customers", customers);

app.use("/", home);

// check env.NODE_ENV to see if we are development or not
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug("Morgan enabled...");
}

app.listen(port, () => console.log(`server is running on ${port}...`));