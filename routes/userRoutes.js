const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const {jwtAuthMiddleware, generateToken} = require('../jwt');
const Pedrecord = require('../models/pedrecord'); 
const Rule = require('../models/Rule');
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
            console.log( await user.comparePassword(password));
            
            return res.status(401).json({error: 'Invalid badgeNumber or password'});
        }
        res.status(200).json({message: 'Login Successful'});

        //generate token after expire
        // const payload ={
        //     id: user.id,
        // }
        // const token = generateToken(payload);

        // //return token as response
        // res.json({token: token});

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

// POST route to add violation list 
router.patch('/violationRoute', async(req,res)=>{

try{
    const { rule, licenseNum, badgeNumber } = req.body; // violationlist contain violators with their crime
          
     // Validate request data
      if (!licenseNum || !badgeNumber) {
        return res.status(400).json({ message: 'License number or badge number is missing' });
      }

    // Fetch the user making the change in violation record      
    const issuer = await User.findOne({badgeNumber: badgeNumber});
    if (!issuer) {
        return res.status(404).json({ message: 'Issuer not found' });
      }
    const trafficPersonal = issuer.name;

    // Fetch the violator’s record
    const victim =  await Pedrecord.findOne({
      licenseNum:licenseNum});
    // console.log(victim);
    
    if (!victim) {
        return res.status(404).json({ message: 'Victim not found' });
      }
    const violator=victim.name;

    
    const ruleIds = rule.map(r => r.id);
    console.log("hi");
    console.log(ruleIds);
    
    // Fetch penalty information if `id` is provided
    let fine = 0;
    if (rule) {
      const penalty = await Rule.findById(rule);
      if (penalty) {
        fine = penalty.fine;
      } else {
        return res.status(404).json({ message: 'Penalty rule not found' });
      }
    }

    console.log("ih");
    
// validate and fetch rules for each violation in the list

// const dbrule = await Rule.findById(rule);
// console.log(dbrule);


    // Convert `rule` to an array of IDs if it's not already

  
    console.log(ruleIds);
    
    // Fetch and validate rules for each violation in the list
    const victimViolations = await Promise.all(
      ruleIds.map(async (rule) => {
        console.log("rule",rule);
        
        const rulerecord = await Rule.findById(rule);
        if (!rulerecord) {
          res.status(404).json(`Rule with ID ${rule} not found`);
        }
        // return ruleRecord;
        await violationlist.save();
      })
    );

// const rulesArray = Array.isArray(dbrule) ? dbrule : [dbrule];

// const victimViolations = await Promise.all(
//   rulesArray.map(async (violation) => {
    
//     const rule = await dbrule.findById(violation);
//     console.log("not ok");
  
//   if (!rule){
//     res.status(404).json({message: "Rule not found"});
//   }
//     await violationlist.save();
//   })
//  )

 
// await violationlist.save();

// Calculate the total fine
const totalFine = await victimViolations.reduce(
  async (totalPromise, violation) => {
    const total = await totalPromise;
    // const rule = await rule.findById(violation);
    if (!rule) {
      res.status(404).json({message:`Rule with ID ${rule.id} not found during calculation`});
    }
    return total + rule.fine;
  },
  Promise.resolve(0)
);
// const totalFine = victimViolations.reduce((total, violation) => total + rule.fine, 0);

   
const newViolationRecord = await violationlist.create({
    trafficPersonal,
    licenseNum,
    violator,
    violationRecords: victimViolations,
    fine:totalFine
  });

  res.status(201).json({
    message: 'Violation record added successfully',
    violationRecord: newViolationRecord
  });

    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error');
    }
});

module.exports = router;