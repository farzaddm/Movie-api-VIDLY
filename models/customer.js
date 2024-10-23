const mongoose = require("mongoose");
const Joi = require("joi"); // class

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
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
  })
);

const validateCustomers = (customer) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    isGold: Joi.boolean(),
    phone: Joi.string().length(11),
  });
  return schema.validate(customer);
};

exports.Customer = Customer;
exports.validate = validateCustomers;