const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");


router.post("/", async (req, res) => {
  
    const user = await User.findOne({ email: req.body.email })
      
        if (!user) return res.status(400).send("Invalid email or password");

        const isValid = await bcrypt.compare(req.body.password, user.password)
        
        if (!isValid) return res.status(400).send("Invalid email or password");

        const {email,name,role,address} = user
        const userInfo = {email,name,role,address}
     
        const token = user.generateAuthToken();
         
        res.cookie('auth-token', token).json({ user, token })
        
  });



  module.exports = router