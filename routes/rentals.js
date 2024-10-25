const express = require("express");
const debug = require("debug")("rentals:mongodb");
const Fawn = require("fawn");

const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
// ====================================================
const router = express.Router();

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer.");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie.");

  if (movie.numberInStock === 0) return res.status(400).send("Movie not in stock.");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  // Use Fawn Task for two-phase commit (Transaction)
  try {
    new Fawn.Task()
      .save("rentals", rental) // Save rental
      .update("movies", { _id: movie._id }, { 
        $inc: { numberInStock: -1 }
      })
      .run();  // Run the transaction

    res.send(rental); // Send response if successful
  } catch (err) {
    debug(err.message);
    res.status(500).send("Transaction failed.");
  }
});

module.exports = router;