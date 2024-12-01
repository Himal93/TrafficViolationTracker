const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtAuthMiddleware = (req, res, next) =>{

    // check if the authorization header exists
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({error: 'Authorization header missing'});
    }

    // extract the jwt token fron the request headers or cookie
    const token = authHeader && authHeader.startsWith('Bearer') 
    ? authHeader.split(' ')[1] 
    : req.cookies.accessToken;

    if(!token) 
        return res.status(401).json({error: 'Unauthorized'});
    
    try{
        // verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attach user information to the request object (i.e payload)
        next(); //route handler or continue to next middleware
    }catch(err){
        console.error(err);
        res.status(401).json({error: 'Invalid or expired access token'});
    }
};


// // function to generate JWT token
const generateToken = (userData) => {
//     // Generate a new JWT token using user data
    return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '15m'}); // Access token for 15 minutes
}

const generateRefreshToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' }); // Refresh token for 7 days
  };

module.exports = {jwtAuthMiddleware, generateToken, generateRefreshToken};