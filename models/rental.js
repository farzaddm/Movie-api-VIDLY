const mongoose = require("mongoose");
const Joi = require("joi");


const Rental = mongoose.model(
  "Rental",
  new mongoose.Schema({
    customer: {
      type: new mongoose.Schema({
        isGold: {
          type: Boolean,
          default: false,
        },
        name: {
          type: String,
          required: true,
          minlength: 3,
          maxlength: 50,
        },
        phone: {
          type: String,
          length: 11,
          required: true,
        },
      }),
      require: true,
    },
    movie: {
      type: new mongoose.Schema({
        title: {
          type: String,
          required: true,
          trim: true,
          minlength: 3,
          maxlength: 255,
        },
        dailyRentalRate: {
          type: Number,
          require: true,
          min: 0,
          max: 255,
        },
      }),
      require: true,
    },
    dateOut: {
      type: Date,
      required: true,
      defualt: Date.now,
    },
    dateReturned: {
      type: Date,
    },
    rentalFee: {
      type: Number,
      min: 0,
    },
  })
);

const validateRentals = (rental) => {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate(rental);
};

exports.Rental = Rental;
exports.validate = validateRentals;
