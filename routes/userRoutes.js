const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const {jwtAuthMiddleware, generateToken} = require('../jwt');
const Pedrecord = require('../models/user'); 
const violationlist = require('../models/voilation.model');


// function to check if an admin exists
// const checkAdminExists = async () => {
//     const admin = await User.findOne({ role: 'admin' });
//     return admin ? true : false;
// };



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
        res.status(200).json({message: 'Login Successful'});

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
});

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


  // POST route to add a user
  router.post('/violationRoute', async(req,res)=>{
    try{
            const { violationlist } = req.body; // violationlist contain violators with their crime
          
            // Fetch the user making the change in violation record
            const user = await User.findOne(req.user.licenseNum);

            // Validate and fetch violation
            const populatedOrderItems = await Promise.all(
              orderItems.map(async (item) => {
                const product = await Record.findById(item.productId);
          
                await product.save();
          
                return {
                  productId: product._id,
                  quantity: item.quantity,
                  name: product.productname,
                  image: product.productImage,
                };
              })
            );
            // Calculate the total price
            const totalPrice = await populatedOrderItems.reduce(
              async (totalPromise, item) => {
                const total = await totalPromise;
                const product = await Product.findById(item.productId);
                if (!product) {
                  throw new ApiError(
                    404,
                    `Product with ID ${item.productId} not found during price calculation`
                  );
                }
                return total + product.price * item.quantity;
              },
              Promise.resolve(0)
            );
          
    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error');
    }
});