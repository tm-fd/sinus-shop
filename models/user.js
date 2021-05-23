const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
require('dotenv').config()

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
    role: {
        type: String,
        required: true
    },
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
        },
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
            email: this.email.type,
            name: this.name.type,
            role: this.role.type,
            adress: {
                street: this.adress.street.type,
                zip: this.adress.zip.type,
                city: this.adress.city.type
            }
        }
    }
    const token = jwt.sign(payload, process.env.SECRET);
    console.log(token)
    return token
}

const User = mongoose.model('User', userSchema);


module.exports = User;