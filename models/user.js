const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
require('dotenv').config()

// user model structure
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: {
        type: String,
        required: true
    },
    role: String,
    adress: {
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
            adress: {
                street: this.adress.street,
                zip: this.adress.zip,
                city: this.adress.city
            }
        }
    }
    const token = jwt.sign(payload, process.env.SECRET);
    return token
}

const User = mongoose.model('User', userSchema);


module.exports = User;