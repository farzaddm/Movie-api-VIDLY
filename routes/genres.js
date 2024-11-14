const express = require("express");
const { Genre, validate } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require('../middleware/validateObjectId');
// ===========================================================
const router = express.Router();

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {  
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send("Genre not found.");
  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  const genre = new Genre({ name: req.body.name });
  await genre.save();
  res.send(genre);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  // first check the auth and then go to admin
  const genre = await Genre.deleteOne({ _id: req.params.id });
  if (!genre) return res.status(404).send("Genre not found.");
  res.send(genre);
});

module.exports = router;
