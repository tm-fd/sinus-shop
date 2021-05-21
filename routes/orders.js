const router = require('express').Router();
const User = require('../models/user');
const Order = require('../models/order');
const Product = require('../models/product');
//const mongoose = require('mongoose');
//const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
router.use(cookieParser());

require('dotenv').config()

router.get('/api/orders', async (req, res) => {
    // checking if not cookies from tokens then 204 status.
    if (!req.cookie['auth-token']) {
        res.status(204).send("No Content - Bara för inloggade")
        // else the rest is inside, which means only for logged in users.
    } else {
        const user = await User.findOne({ name: req.body.name })

        bcrypt.compare(req.body.password, user.password, async (err, result) => {
            if (err) {
                res.json(err)
            } else {
                if (user.role === 'admin') {
                    const orders = await Order.find();
                    res.json(orders);
                } else {
                    const user = await User.findOne({ name: req.body.name, password: req.body.password }, { orderHistory: 1 }).populate('orderHistory');
                    res.json(user.orderHistory);
                }
            }
        })
    }
});

router.post('/api/orders', async (req, res) => {

    console.log(req.cookies['auth-token']);
    if (!req.cookies['auth-token']) {
        res.send("Bara för inloggade.")
    } else {
        const user = await User.findOne({ name: req.body.name })
        bcrypt.compare(req.body.password, user.password, async result => {
            if (!result) {
                // Failed authentication 
            } else {
                const user = await User.findOne({ name: req.body.name });
                let items = req.body.items;
                if(!items){
                    res.status(404).send('finns inget');
                    return;
                }
                const allProducts = await Product.find({ _id: { $in: items } });
                let order = new Order({
                    timeStamp: Date.now(),
                    status: true,
                    items: items,
                    orderValue: allProducts.reduce((total, prod) => total + prod.price, 0)
                });

                await Order.create(order);

                const result = await User.findByIdAndUpdate(user._id, { $push: { orderHistory: order._id } });
                console.log(result)

                res.json(order);
            }
        })
    }
});


module.exports = router;