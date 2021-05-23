const jwt = require('jsonwebtoken')
require('dotenv').config()

function authorizationMiddleware(req, res, next){

    const token = req.cookies['auth-token'];
    if(!token) return res.status(401).send('Access denied. No token')

    try{
        const decodedToken = jwt.verify(token, process.env.SECRET);
        req.decodedToken = decodedToken;
        next();
    }
    catch(exp){
        res.status(400).send('Invalid token')
    }
}

module.exports = authorizationMiddleware