const express = require("express");
const debug = require("debug")("genres:mongodb");
const { Genre, validate } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
// ===========================================================
const router = express.Router();

router.get("/", async (req, res) => {
  throw new Error("could not get genres.");

  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send("Genre not found.");
    res.send(genre);
  } catch (err) {
    debug(err.message);
    return res.status(500).send("Internal server error.");
  }
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  const genre = new Genre({ name: req.body.name });
  try {
    await genre.save();
    res.send(genre);
  } catch (err) {
    debug(err.message);
    return res.status(500).send("Failed to save genre.");
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  try {
    let genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    res.send(genre);
  } catch (err) {
    debug(err.message);
    return res.status(404).send("Genre not found.");
  }
});

router.delete("/:id", [auth, admin], async (req, res) => {
  // first check the auth and then go to admin
  try {
    const genre = await Genre.deleteOne({ _id: req.params.id });
    if (!genre) return res.status(404).send("Genre not found.");
    res.send(genre);
  } catch (err) {
    debug(err.message);
  }
});

module.exports = router;
