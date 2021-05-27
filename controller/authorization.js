const jwt = require('jsonwebtoken')
require('dotenv').config()

const authorizationMiddleware = async (req, res, next) => {
// read the token in the cookies 
    const token = req.cookies['auth-token'];
// if it was empty stop the proecess by return response message
    if(!token) return res.status(401).send('Access denied. You are not authorize')

    try{
        // decode the token in the cookies, get the paylood then read and verfiy the secret with the in the server
        const decodedToken = jwt.verify(token, process.env.SECRET);
        // access the decoded token by assign it to the request
        req.decodedToken = decodedToken;
        // move to the next middleware
        next();
    }
    catch(exp){
        res.status(400).send('Invalid token')
    }
}

module.exports = authorizationMiddleware