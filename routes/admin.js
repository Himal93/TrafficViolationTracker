const express = require("express");
const router = express.Router();
const Record = require("../models/pedrecord");
const Rule = require("../models/Rule");
const User = require("./../models/user");
const { jwtAuthMiddleware, generateToken } = require("../middleware/jwt");

// Create a new rule
router.post("/rules", async (req, res) => {
  const { title, fine } = req.body;
  try {
    const rule = new Rule({ title, fine });
    await rule.save();
    res.status(201).json(rule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get list of rules
router.get("/allrules", async (req, res) => {
  try {
    const rules = await Rule.find();
    res.json(rules);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a rule
router.delete("/rules/:id", async (req, res) => {
  try {
    await Rule.findByIdAndDelete(req.params.id);
    res.json({ message: "Rule deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a rule
router.put("/rules/:id", async (req, res) => {
  try {
    const rule = await Rule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(rule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST route to add a user
router.post("/register", jwtAuthMiddleware, async (req, res) => {
  try {
    const data = req.body; //assuming request body conatins user data

    // Create a new user document using Mongoose model
    const newUser = new User(data);

    //Save the new user to the database
    const response = await newUser.save();
    console.log("data saved");

    const payload = {
      id: response.id, //here response.id use object id i.e _id from data
    };
    const token = generateToken(payload);
    // console.log('Token is:', token);

    res.status(200).json({ response: response, token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal server error");
  }
});

//GEt method to retrive the User
router.get("/getAllUser", async (req, res) => {
  try {
    const data = await User.find();
    // console.log('data fetched');
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal server error");
  }
});

module.exports = router;
