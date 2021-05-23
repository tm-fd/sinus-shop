const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
require('dotenv').config();

// user model structure
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    address: {
        street: String,
        zip: String,
        city: String,
    },
    orderHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }]
});


// generate user authentication token
userSchema.methods.generateAuthToken = function(){
    const payload = {
        user: {
            email: this.email,
            name: this.name,
            role: this.role,
            address: this.address
        }
    }
    const token = jwt.sign(payload, process.env.SECRET);
    return token
}

const User = mongoose.model('User', userSchema);


module.exports = User;