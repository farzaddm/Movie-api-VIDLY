const express = require("express");
const debug = require("debug")("movies:mongodb");
const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
// ===========================================================
const router = express.Router();

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("name");
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send("Movie not found.");
    res.send(movie);
  } catch (err) {
    debug(err.message);
    return res.status(500).send("Internal server error.");
  }
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const movie = new Movie({
    title: req.body.title,
    genre: {
        _id: genre._id,
        name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  try {
    await movie.save();
    res.send(movie);
  } catch (err) {
    debug(err.message);
    return res.status(500).send("Failed to save movie.");
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  try {
    let movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send("Movie not found.");

    movie.name = req.body.name || movie.name;
    movie.genre = req.body.genre !== undefined ? req.body.genre : movie.genre;
    movie.numberInStock = req.body.numberInStock || movie.numberInStock;
    movie.dailyRentalRate = req.body.dailyRentalRate || movie.dailyRentalRate;

    movie = await movie.save();
    res.send(movie);
  } catch (err) {
    debug(err.message);
    return res.status(500).send("Failed to update movie.");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const movie = await Movie.deleteOne({ _id: req.params.id });
    if (!movie) return res.status(404).send("Movie not found.");
    res.send(movie);
  } catch (err) {
    debug(err.message);
  }
});

module.exports = router;
