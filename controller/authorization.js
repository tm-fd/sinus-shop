const jwt = require('jsonwebtoken')
require('dotenv').config()

const authorizationMiddleware = async (req, res, next) => {

    const token = req.cookies['auth-token'];
    if(!token) return res.status(401).send('Access denied. You are not authorize')

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