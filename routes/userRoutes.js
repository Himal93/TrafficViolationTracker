const express = require("express");
const router = express.Router();
const User = require("./../models/user");
const {
  jwtAuthMiddleware,
  generateToken,
  generateRefreshToken,
} = require("../middleware/jwt");
const Pedrecord = require("../models/pedrecord");
const Rule = require("../models/Rule");
const violationlist = require("../models/voilation.model");
const mongoose = require("mongoose");

// function to check if an admin exists
// const checkAdminExists = async () => {
//     const admin = await User.findOne({ role: 'admin' });
//     return admin ? true : false;
// };

// Login route
router.post("/login", async (req, res) => {
  try {
    // extract badgeNumber and password from request body
    const { badgeNumber, password } = req.body;

    // find user by badgeNumber
    const user = await User.findOne({ badgeNumber: badgeNumber });

    // if user doesnt exist or password doesnt match, return err
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid badgeNumber or password" });
    }

    // generate token after expire
    const payload = {
      id: user.id,
    };
    const accessToken = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // set token in HTTP-only cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      secure: false,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, //15 min
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: false,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ message: "Login Successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal server error");
  }
});

// Refresh token endpoint
router.post("/refreshToken", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token missing" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const payload = { id: decoded.id };

    // Generate a new access token
    const newAccessToken = generateToken(payload);

    // Set the new access token in cookies
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(200).json({ message: "Access token refreshed" });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid or expired refresh token" });
  }
});

// logout route
router.post("/logout", (req, res) => {
  res.clearCookie("accessToken", { httpOnly: true, sameSite: "strict" });
  res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
  res.status(200).json({ message: "Logout successful" });
});

// profile route
router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    // Extract user data from JWT payload in jwt.js
    const userData = req.user;

    // get user id from payload
    const userID = userData.id;

    // fetch user details from db using user id
    const user = await User.findById(userID);

    // if no user found
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // send back the user data as a response
    res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal server error");
  }
});

// PUT method to change the password
router.put("/profile/password", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; //extract the id from token
    const { currentPassword, newPassword } = req.body; //extract current and new password from request body

    // find the user by userID
    const user = await User.findById(userId);

    // if password doesnt match, return err
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // update the user's password
    user.password = newPassword;
    await user.save();

    console.log("password updated");
    res.status(200).json({ message: "Password updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal server error");
  }
});

// POST route to add violation list
router.patch("/violationRoute", async (req, res) => {
  try {
    const { rule, licenseNum, badgeNumber } = req.body; // violationlist contains violators with their crimes

    // Validate request data
    if (!licenseNum || !badgeNumber) {
      return res
        .status(400)
        .json({ message: "License number or badge number is missing" });
    }

    // Fetch the user making the change in violation record
    const issuer = await User.findOne({ badgeNumber: badgeNumber });
    if (!issuer) {
      return res.status(404).json({ message: "Issuer not found" });
    }
    const trafficPersonal = issuer.name;

    // Fetch the violator’s record
    console.log(licenseNum);

    const victim = await Pedrecord.findOne({ licenseNum: licenseNum });
    console.log(victim);

    if (!victim) {
      return res.status(404).json({ message: "Victim not found" });
    }
    const violator = victim.name;

    // Extract only the `id` values from the `rule` array
    const ruleIds = rule.map((r) => r.id);
    // console.log("Extracted ruleIds:", ruleIds);

    // need to review-->
    // [// Validate Rule IDs
    // if (ruleIds.some(ruleId => !mongoose.Types.ObjectId.isValid(ruleId))) {
    //   return res.status(400).json({ message: 'One or more Rule IDs are invalid' });
    // }

    // // Fetch all rules in one go
    // const victimViolations = await Rule.find({ _id: { $in: ruleIds } });
    // if (victimViolations.length !== ruleIds.length) {
    //   return res.status(400).json({ message: 'Some rules not found' });
    // }]

    // Fetch and validate rules for each violation in the list
    const victimViolations = await Promise.all(
      ruleIds.map(async (ruleId) => {
        // console.log("Fetching rule with ID:", ruleId);
        const ruleRecord = await Rule.findById(ruleId);
        if (!ruleRecord) {
          throw new Error(`Rule with ID ${ruleId} not found`);
        }
        return ruleRecord; // return the rule record for further use
      })
    );

    // Calculate the total fine based on the fetched rules
    const totalFine = victimViolations.reduce(
      (total, violation) => total + violation.fine,
      0
    );

    // Save the new violation record
    const newViolationRecord = await violationlist.create({
      trafficPersonal,
      licenseNum,
      violator,
      violationRecords: victimViolations,
      fine: totalFine,
    });

    await victim.violationRecords.push(
      ...victimViolations.map((v) => ({
        title: v.title, // Assuming `title` field in Rule
        fine: v.fine,
      }))
    );

    // Save the updated Pedrecord
    await victim.save();

    res.status(201).json({
      message: "Violation record added successfully",
      violationRecord: newViolationRecord,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

module.exports = router;
