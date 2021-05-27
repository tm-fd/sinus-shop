const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");



router.post("/", async (req, res) => {

      // find the user in the DB
      const user = await User.findOne({ email: req.body.email })

      // response message if the user is not exists in DB
      if (!user) return res.status(400).send("Invalid email or password");

      // compare between user inputed password and the one in the DB 
      const isValid = await bcrypt.compare(req.body.password, user.password)

      // check if the password matches the hashed password in the DB
      if (!isValid) return res.status(400).send("Invalid email or password");
      
      // generate and assign a token
      const token = user.generateAuthToken();

      // name the cookie value 
      res.cookie('auth-token', token).send({token: token, user })
      
});



module.exports = router
 