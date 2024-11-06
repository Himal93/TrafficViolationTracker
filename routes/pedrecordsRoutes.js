const express = require('express');
const router = express.Router();
const User = require('../models/pedrecord');
const {jwtAuthMiddleware, generateToken} = require('../jwt');
const Pedrecord = require('../models/pedrecord');

// checks weather user is trafficPedrecordal or admin
const checkAdminRole= async(userID) =>{
    try{
        const user = await User.findById(userID);
        return user.role === 'admin';
    }catch(err){
        return false;
    }
}

// POST route to add a pedrecord
router.post('/', jwtAuthMiddleware, async(req,res)=>{
    try{
        if(!checkAdminRole(req.user.id))
            return res.status(403).json({message: 'user does not have admin role'})
        
        const data = req.body  //assuming request body conatins pedrecord data

        // Create a new pedrecord document using Mongoose model
        const newPedrecord = new Pedrecord(data);

        //Save the new pedrecord to the database
        const response = await newPedrecord.save();
        console.log('data saved');

        res.status(200).json({response: response});

    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error');
    }
});

// PUT method to update the data in databases
router.put('/:pedrecordID', jwtAuthMiddleware, async(req,res)=>{
    try{
        if(!checkAdminRole(req.user.id))
            return res.status(403).json({message: 'user does not have admin role'})

        const pedrecordID = req.params.pedrecordID; //extract the id from url parameter
        const updatedPedrecordData = req.body; //updated data for the Pedrecord

        const response = await Pedrecord.findByIdAndUpdate(pedrecordID, updatedPedrecordData, {
            new: true,   //returns updated documnet
            runValidators: true  //run mongoose validation
        });
        if(!response){
            return res.status(404).json({error: 'Pedrecord not found'});
        }

        console.log('Pedrecord data updated');
        res.status(200).json(response);

    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error');
    }
});

//GEt method to retrive the pedrecord
router.get('/getAllPedRecord', async(req, res) =>{
    try{
        const data = await Pedrecord.find();
        console.log('data fetched');
        res.status(200).json(data);
    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error');
    }
});


// DELETE method
router.delete('/:pedrecordID', jwtAuthMiddleware, async(req,res)=>{
    try{
        if(!checkAdminRole(req.user.id))
            return res.status(403).json({message: 'user does not have admin role'}) 

        const pedrecordID = req.params.pedrecordID; //extract the id from url parameter

        const response = await Pedrecord.findByIdAndDelete(pedrecordID);

        if(!response){
            return res.status(404).json({error: 'Pedrecord not found'});
        }

        console.log('Pedrecord data updated');
        res.status(200).json(response);

    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error');
    }
});


module.exports = router;