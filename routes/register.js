const mongoose = require('mongoose')

const router = require('express').Router()
const User = require('../models/user')

const bcrypt = require('bcrypt')
const saltRounds = 10


//Registrera ny användare
router.post('/', async (req, res) => {

    //Kollar om email finns i user collection
    const user = await User.findOne({ email: req.body.email })    

    //Om inmatad email inte finns gör nedan: skapa ny användare
    if (!user) {

        //kryptera lösenordet
        await bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
            if (err)
                res.json(err)
            else {

                //skapa en ny användare enligt model
                const newUser = new User({
                    // _id: new mongoose.Types.ObjectId(),
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

                //spara användaren
                newUser.save((err) => {
                    if (err) {
                        console.error(err)
                    }
                    else {
                        // res.json(newUser) 
                        return res.status(400).send(`New user registered: ${req.body.email}`)
                    }
                })

                //Här?
                const error = newUser.validateSync()
                if (error) {
                    res.send(error.message)
                } else {
                    res.json(newUser)
                }
            } 
        })
    }  else {
        //Annars kör denna: emailadressen finns redan registrerad
        return res.status(400).send(`${req.body.email} is already registered`)
    }
})


module.exports = router;
