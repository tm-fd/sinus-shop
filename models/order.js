const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    timeStamp: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    items: [  
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products'
        }],
        orderValue: {
            type: Number,
            required: true
        }
});

const Order = mongoose.model('Order', orderSchema);




module.exports = Order;