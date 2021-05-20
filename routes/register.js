const express = require("express");
const router = express.Router();
const User  = require("../models/user");
const bcrypt = require("bcryptjs");

// async function createUser(user) {
//     user.password = await bcrypt.hash(user.password, await bcrypt.genSalt(10));
//     return await new User(user).save();
     
//   }

// router.post("/", async (req, res) => {
  
//     // User.findOne({ email: req.body.email })
//     //   .then(user => {
//     //     if (user) return res.status(400).send("User already registered.");
  
//       const newUser = await createUser(req.body)
            
//             //res.header("x-auth-token", newUser.generateAuthToken())
//                console.log(newUser)
//           })

router.post('/', (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) res.json(err)
        else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: hash,
                role: 'admin',
                address: {
                    street: req.body.street,
                    zip: req.body.zip,
                    city: req.body.city,
                },
                // orderHistory: [{
                //     type: '',
                //     ref: 'Order'
                // }]
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
      
 module.exports = router