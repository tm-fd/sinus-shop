const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
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

const User = mongoose.model('User', userSchema);

module.exports = User;