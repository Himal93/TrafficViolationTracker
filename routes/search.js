const express = require('express');
const router = express.Router();
const Record = require('../models/pedrecord');

// // after login ....searching with liscense number
// router.post('/login/search/:licensenumber', async(req, res)=>{
//     try{
//         // Extract licensenumber from the request body
//         const { licensenumber} = req.body;

//         // Validate that licensenumber is provided
//         if (!licensenumber) {
//             return res.status(400).json({ error: 'License number is required' });
//         }
//         // Search for the pedrecord with the given licensenumber
//         let pedrecord = await pedrecord.findOne({ licensenumber });

//         // If no pedrecord found, return a 404 error
//         if (!pedrecord) {
//             return res.status(404).json({ message: 'Pedrecord not found' });
//         }

//     }catch(err){
//         console.log(err);
//         res.status(500).json('Internal server error');
//     }
// })

// GET /search/:licenseNumber - Search for a record by licenseNumber
router.get('/search/:licenseNumber', async (req, res) => {
  try{
    const record = await Record.findOne({ licenseNumber: req.params.licenseNumber });
    if (record) {
        res.json(record);
    } else {
        res.status(404).json({ message: 'Record not found' });
    }
  }catch(err){
    console.log(err);
        res.status(500).json('Internal server error');
  }
});

// PUT /search/edit/:licenseNumber - Update citation record by licenseNumber
router.put('/search/edit/:licenseNumber', async (req, res) => {
    const { violationRecord } = req.body; // Assuming we are updating only citation
    try {
        const updatedRecord = await Record.findOneAndUpdate(
            { licenseNumber: req.params.licenseNumber },
            { $set: { violationRecord } },
            { new: true }
        );
        res.json(updatedRecord);
    } catch (error) {
        res.status(500).json({ message: 'Error updating record' });
    }
});

module.exports = router;