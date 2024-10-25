const express = require("express");
const debug = require("debug")("users:mongodb");
const { User, validate } = require("../models/user");
const _ = require("lodash");

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ['name', 'email', 'password']));

  try {
    await user.save();
    res.send(_.pick(user, ['_id', 'name', 'email']));
  } catch (err) {
    debug(err.message);
    return res.status(500).send("Failed to save user.");
  }
});

module.exports = router;
