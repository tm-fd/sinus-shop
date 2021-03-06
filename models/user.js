const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

require('dotenv').config();

// user model structure
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: String,
    adress: {
        street: {
            type: String,
            required: true
        },
        zip: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        }
    },
    orderHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }]
});

// generate user authentication token
userSchema.methods.generateAuthToken = function(){
    const payload = {
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        user: {
            email: this.email,
            name: this.name,
            role: this.role,
            adress: this.adress
        }
    }
    const token = jwt.sign(payload, process.env.SECRET);
    return token
}

const User = mongoose.model('User', userSchema);


module.exports = User;