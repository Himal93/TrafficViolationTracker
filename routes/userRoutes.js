const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const {jwtAuthMiddleware, generateToken} = require('../jwt');
const Pedrecord = require('../models/user'); 


// function to check if an admin exists
const checkAdminExists = async () => {
    const admin = await User.findOne({ role: 'admin' });
    return admin ? true : false;
};

// POST route to add a user
router.post('/signup', async(req,res)=>{
    try{
        const data = req.body  //assuming request body conatins user data

        // id role is admin, check if another admin exists
        if (data.role === 'admin') {
            const adminExists = await checkAdminExists();
            if (adminExists) {
                return res.status(403).json({ message: 'Admin already exists. Only one admin is allowed.' });
            }
        }

        // Create a new user document using Mongoose model
        const newUser = new User(data);

        //Save the new user to the database
        const response = await newUser.save();
        console.log('data saved');

        const payload = {
            id: response.id, //here response.id use object id i.e _id from data
        }
        const token = generateToken(payload);
        console.log('Token is:', token);

        res.status(200).json({response: response, token: token});

    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error');
    }
});

// Login route
router.post('/login', async(req, res) =>{
    try{
        // extract badgeNumber and password from request body
        const{badgeNumber, password} = req.body;

        // find user by badgeNumber
        const user = await User.findOne({badgeNumber: badgeNumber});
        
        // if user doesnt exist or password doesnt match, return err
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid username or password'});
        }

        //generate token after expire
        const payload ={
            id: user.id,
        }
        const token = generateToken(payload);

        //return token as response
        res.json({token: token});

    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error');
    }
})

// profile route
router.get('/profile',jwtAuthMiddleware ,async(req, res) =>{
    try{
        // Extract user data from JWT payload in jwt.js
        const userData = req.user;

        // get user id from payload
        const userID = userData.id;

        // fetch user details from db using user id
        const user = await User.findById(userID);

        // if no user found
        if(!user){
            return res.status(404).json({error: 'User not found'});
        }
        // send back the user data as a response
        res.status(200).json({user});

    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error');  
    }
})

// PUT method to change the password
router.put('/profile/password', jwtAuthMiddleware, async(req,res)=>{
    try{
        const userId = req.user; //extract the id from token
        const {currentPassword, newPassword} = req.body; //extract current and new password from request body

        // find the user by userID
        const user = await User.findOne({userID});

        // if password doesnt match, return err
        if(!(await user.comparePassword(currentPassword))){
            return res.status(401).json({error: 'Invalid username or password'});
        }

        // update the user's password
        user.password = newPassword;
        await user.save();

        console.log('password updated');
        res.status(200).json({message: 'Password updated'});

    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error');
    }
});


module.exports = router;