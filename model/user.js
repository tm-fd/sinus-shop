const mongoose = require('mongoose');
// const Order = require('../model/order');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    email: String,
    password: String,
    role: String,
    adress: {
        street: String,
        zip: Number,
        city: String,
    },
    // orderHistory: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Order'
    // }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;