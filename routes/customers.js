const express = require("express");
const { Customer, validate } = require("../models/customer");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
// ====================================================
const router = express.Router();

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

router.get("/:id", async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send("customer not found.");
    res.send(customer);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  const customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });

  await customer.save();
  res.send(customer);
});

router.put("/:id", auth, async (req, res) => {
  let customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send("Customer not found.");

  customer.name = req.body.name || customer.name;
  customer.isGold =
    req.body.isGold !== undefined ? req.body.isGold : customer.isGold;
  customer.phone = req.body.phone || customer.phone;

  await customer.save();
  res.send(customer);
});

router.delete("/:id", [admin, auth], async (req, res) => {
  const customer = await Customer.deleteOne({ _id: req.params.id });
  if (!customer) return res.status(404).send("customer not found.");
  res.send(customer);
});

module.exports = router;
