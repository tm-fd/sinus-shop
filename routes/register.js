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
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                email: req.body.email,
                password: hash,
                role: 'customer',
                adress: {
                    street: req.body.street,
                    zip: req.body.zip,
                    city: req.body.city,
                },
                orderHistory: []
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