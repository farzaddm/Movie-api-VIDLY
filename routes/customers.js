const express = require("express");
const mongoose = require("mongoose");
const debug = require("debug")("genres:mongodb");
const Joi = require("joi"); // class
// ====================================================
const router = express.Router();

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
      required: true
    }
  })
);

const validateCustomers = (customer) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    isGold: Joi.boolean(),
    phone: Joi.String().length(11),
  });
  return schema.validate(customer);
};
// -------------------------------------------------------
router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send("customer not found.");
    res.send(customer);
  } catch (err) {
    debug(err.message);
    return res.status(500).send("Internal server error.");
  }
});

router.post("/", async (req, res) => {
  const { error } = validateCustomers(req.body);
  if (error) return res.status(400).send(error.message);

  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });
  try {
    customer = await Customer.save();
    res.send(customer);
  } catch (err) {
    debug(err.message);
    return res.status(500).send("Failed to save customer.");
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validateCustomers(req.body);
  if (error) return res.status(400).send(error.message);

  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    res.send(customer);
  } catch (err) {
    debug(err.message);
    return res.status(404).send("customer not found.");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const customer = await Customer.deleteOne({ _id: req.params.id });
    if (!customer) return res.status(404).send("customer not found.");
    res.send(customer);
  } catch (err) {
    debug(err.message);
  }
});

module.exports = router;
