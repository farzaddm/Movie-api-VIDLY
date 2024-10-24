const express = require("express");
const debug = require("debug")("customers:mongodb");
const { Customer, validate } = require("../models/customer");
// ====================================================
const router = express.Router();

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
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  const customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });

  try {
    await customer.save();
    res.send(customer);
  } catch (err) {
    debug(err.message);
    return res.status(500).send("Failed to save customer.");
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  try {
    let customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send("Customer not found.");

    customer.name = req.body.name || customer.name;
    customer.isGold = req.body.isGold !== undefined ? req.body.isGold : customer.isGold;
    customer.phone = req.body.phone || customer.phone;

    await customer.save();
    res.send(customer);
  } catch (err) {
    debug(err.message);
    return res.status(500).send("Failed to update customer.");
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
