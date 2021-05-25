const router = require('express').Router()
const User = require('../models/user')

const bcrypt = require('bcrypt')
const saltRounds = 10


//Registrera ny användare
router.post('/', async (req, res) => {


    //Kollar om email finns i user collection
    const email = await User.findOne({ email: req.body.email })    

    //Om inmatad email inte finns gör nedan: skapa ny användare
    if (!email) {

        //kryptera lösenordet
        await bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
            if (err)
                res.json(err)
            else {

                //skapa en ny användare enligt model
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                    role: req.body.role ? req.body.role : 'customer',
                    adress: {
                        street: req.body.adress.street,
                        zip: req.body.adress.zip,
                        city: req.body.adress.city,
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
                        return res.status(402).send(`New user registered: ${req.body.email}`)
                    }
                })

            } 
        })
    }  else {
        //Annars kör denna: emailadressen finns redan registrerad
        return res.status(409).send(`${req.body.email} is already registered`)
    }

})


module.exports = router;
