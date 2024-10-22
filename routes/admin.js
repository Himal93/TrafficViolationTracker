const express = require('express');
const router = express.Router();
const Record = require('../models/pedrecord');
const Rule = require('../models/Rule');

// Create a new rule
router.post('/rules', async (req, res) => {
    const { title, description } = req.body;
    try {
      const rule = new Rule({ title, description });
      await rule.save();
      res.status(201).json(rule);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Get list of rules
  router.get('/rules', async (req, res) => {
    try {
      const rules = await Rule.find();
      res.json(rules);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Delete a rule
  router.delete('/rules/:id', async (req, res) => {
    try {
      await Rule.findByIdAndDelete(req.params.id);
      res.json({ message: 'Rule deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Update a rule
  router.put('/rules/:id', async (req, res) => {
    try {
      const rule = await Rule.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(rule);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  module.exports = router;