const router = require('express').Router();
const User = require('../model/user');
const Order = require('../model/order');
const Product = require('../model/product');
const mongoose = require('mongoose');

router.get('/api/orders', async (req, res) => {
    const user = await (await User.findOne({ name: req.body.name, password: req.body.password}));

    if (user.role === 'admin') {
        const orders = await Order.find();
        console.log(JSON.stringify(orders));
        res.json(orders);
    } else if (user.role === 'kund') {
        const user = await User.findOne({ name: req.body.name, password: req.body.password},
        { orderHistory: 1 }).populate('orderHistory');
        res.json(user.orderHistory);
    }
});

router.post('/api/orders', async (req, res) => {
    const user = await User.findOne({ name: req.body.name, password: req.body.password });

    let items = req.body.items.split(',');
    items = items.map(el => mongoose.Types.ObjectId(el));
    // Validate products

    const products = await Product.find({ _id: { $in: items }});

    if (items.length !== products.length) {
        // Do something
        res.status(400);
        return;
    }
   
    let order = new Order({
        timeStamp: Date.now(),
        status: true,
        items: products.map(el => el._id),
        orderValue: products.reduce((total, prod) => total + prod.price, 0)
    });

 
    await Order.create(order);

    //user.orderHistory.push(order._id);
    //const result = await User.findByIdAndUpdate(user._id, user);
    const result = await User.findByIdAndUpdate(user._id, { $push: { orderHistory: order._id }});
    if (result.updatedCount == 0) {
        // Didn't work
    }
    res.json(order);
});


module.exports =router;