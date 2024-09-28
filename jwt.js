const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtAuthMiddleware = (req, res, next) =>{

    // check if the authorization header exists
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({error: 'Authorization header missing'});
    }

    // extract the jwt token fron the request headers
    const token = authHeader.split(' ')[1];
    if(!token) return res.status(401).json({error: 'Unauthorized'});
    
    try{
        // verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // attach user information to the request object (i.e payload)
        req.user = decoded; //.jwtPayload
        next(); //route handler or continue to next middleware
    }catch(err){
        console.error(err);
        res.status(401).json({error: 'Invalid token'});
    }
}


// // function to generate JWT token
const generateToken = (userData) => {
//     // Generate a new JWT token using user data
    return jwt.sign(userData, process.env.JWT_SECRET);
}

module.exports = {jwtAuthMiddleware, generateToken};