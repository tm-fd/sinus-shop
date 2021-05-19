const router = require('express').Router();
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
require('dotenv').config()
router.use(cookieParser());
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../model/user')

// Registrera användare
router.post('/',async (req, res) => {

    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        if (err) res.json(err)
        else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: hash,
                role: req.body.role,
                adress: {
                    street: req.body.street,
                    zip: req.body.zip,
                    city: req.body.city,
                },
                orderHistory:[]

            })

            newUser.save((err) => {
                if (err) res.json(err)
                else {
                    res.json(newUser)
                }
            })
        }

    })

// Hämta data för den användare som har det namn som skrivits in
const user = await User.findOne({ name: req.body.name })

if (user) {
    // Kolla om lösenordet stämmer. 
    bcrypt.compare(req.body.password, user.password, function(err, result) {
        if (err) res.json(err)

        if (result !== false) {
            console.log(result)
            const payload = {
                iss: 'zocom',
                exp: Math.floor(Date.now() / 1000) + (60 * 5),
                role: user.role
            }

            // I så fall, signa och skicka token.
            const token = jwt.sign(payload, process.env.SECRET)
            res.cookie('auth-token', token)
            res.send("Välkommen " + user.username)

        } else {
            res.send("Dina credentials stämde inte")
        }
    })

}


})
module.exports = router;