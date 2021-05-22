const mongoose = require('mongoose')

const router = require('express').Router()
const User = require('../models/user')

const bcrypt = require('bcrypt')
const saltRounds = 10


//Registrera ny användare
router.post('/', (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        if (err)
        res.json(err)
        else {
            const newUser = new User({
                email: req.body.email,
                password: hash,
                name: req.body.name,
                role: req.body.role ? req.body.role : 'customer',
                adress: {
                    street: req.body.adress.street,
                    zip: req.body.adress.zip,
                    city: req.body.adress.city
                }
            })
  
            newUser.save((err) =>{
                if(err) {
                    res.json(err)
                }
                else {
                    res.json(newUser)
                }
            })

        }
    })
})


module.exports = router;