const express = require("express");
const debug = require("debug")("genres:mongodb");
const { Genre, validate }= require("../models/genre");
// ===========================================================
const router = express.Router();

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort('name');
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

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  let genre = new Genre({ name: req.body.name });
  try {
    genre = await genre.save();
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
    const genre = await Genre.findByIdAndUpdate(
      req.params.id ,
      { name: req.body.name },
      { new: true }
    );
    res.send(genre);
  } catch (err) {
    debug(err.message);
    return res.status(404).send("Genre not found.");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const genre = await Genre.deleteOne({ _id: req.params.id });
    if (!genre) return res.status(404).send("Genre not found.");
    res.send(genre);
  } catch (err) {
    debug(err.message);
  }
});

module.exports = router;
