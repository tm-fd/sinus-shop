const router = require('express').Router();
const User = require('../models/user');
const Order = require('../models/order');
const Product = require('../models/product');

const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
router.use(cookieParser());
const jwt = require('jsonwebtoken');

require('dotenv').config()

router.get('/api/orders', async (req, res) => {
    console.log(req.cookies['auth-token']);
    if (!req.cookies['auth-token']) {
        res.send("Bara för inloggade.")
    } else {
        const token = req.cookies['auth-token'];
        jwt.verify(token, process.env.SECRET, async (err, payload) => {
            const user = await User.findOne({ name: payload.user.name })
            if (err) {
                res.json(err)
            } else {
                if (user.role === 'admin') {
                    const orders = await Order.find();
                    res.json(orders);
                } 
                else if(user.role === 'kund') {
                    const user = await User.findOne({ name: payload.user.name }, { orderHistory: 1 }).populate('orderHistory');
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
        const token = req.cookies['auth-token'];


        jwt.verify(token, process.env.SECRET, async (err, payload) => {
            if (err) {
                res.json(err)


            } else {
                const user = await User.findOne({ name: payload.user.name })
                let items = req.body.items;
             

                (items === undefined || items === null || items.length === 0 ) ?  res.status(404).send('FEL') : res.status(200).send('BRA')


                const allProducts = await Product.find({ _id: { $in: items } });

                let order = new Order({
                    timeStamp: Date.now(),
                    status: true,
                    items: items,
                    orderValue: allProducts.reduce((total, prod) => total + prod.price, 0)
                });

                await Order.create(order);
                console.log('user._id', user._id)
                console.log('order._id', order._id)
                const result = await User.findByIdAndUpdate(user._id, { $push: { orderHistory: order._id } });
                console.log(result)

                res.json(order);
            }
        })
    }
});


module.exports = router;