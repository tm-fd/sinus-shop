const router = require('express').Router()
const User = require('../models/user')

const bcrypt = require('bcrypt')
const saltRounds = 10


//Registrera ny användare
router.post('/', async (req, res) => {
    // Check if the user's email is already exists in database
    const email = await User.exists({ email: req.body.email});

    if(!email) {

    await bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
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
}
else {
    // if email already exists, return error
   return res.status(400).send({ error: 'Email already exists' })
}
})


module.exports = router;