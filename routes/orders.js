const router = require('express').Router();
const User = require('../model/user');
const Order = require('../model/order');
const Product = require('../model/product');
const mongoose = require('mongoose');


const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
router.use(cookieParser());

require('dotenv').config()


router.get('/api/orders', async (req, res) => {
    console.log(req.cookies['auth-token']);
    if (!req.cookies['auth-token']) {
        res.status(204).send("No Content - Bara för inloggade")
    } else {
        const user = await User.findOne({ name: req.body.name })
      
            bcrypt.compare(req.body.password, user.password, async (err, payload) => {
            if (err) {
                res.json(err)
            } else {
    
                if (user.role === 'admin') {
                    const orders = await Order.find();
                    console.log(JSON.stringify(orders));
                    res.json(orders);
                } else {
                    const user = await User.findOne({ name: req.body.name, password: req.body.password },
                        { orderHistory: 1 }).populate('orderHistory');
                   res.json(user.orderHistory);
                
                }
            } 
        })
    }
});

router.post('/api/orders', async (req, res) => {
    console.log(req.cookies);
    console.log(req.cookies['auth-token']);
    if (!req.cookies['auth-token']) {
        res.send("Bara för inloggade.")
    } else {
        const user = await User.findOne({ name: req.body.name })
     
        bcrypt.compare(req.body.password, user.password, async (err, payload) => {
            if (err) {
                res.json(err)
            } else {
              
                const user = await User.findOne({ name: req.body.name , password: req.body.password  });

    let items = req.body.items.split(',');
    console.log(req.body.items);
    items = items.map(el => mongoose.Types.ObjectId(el));
    
    
    // Validate products
 
    const products = await Product.find({ _id: { $in: items } });
/* 
    if (items.length !== products.length) {
        // meddelande
        res.status(400).send("Det är tomt här !!!!!");
        return;
    }  */

    let order = new Order({
        timeStamp: Date.now(),
        status: true,
        items: products.map(el => el._id),
        orderValue: products.reduce((total, prod) => total + prod.price, 0)
    });


    await Order.create(order);




    //hittar rätt user och updaterar orders info
    const result = await User.findByIdAndUpdate(user._id, { $push: { orderHistory: order._id }});//w
    //const result = await User.findById(user._id).update({ $push: { orderHistory: order._id } });
    if (result.updatedCount == 0) {
        // Didn't work
    }
    res.json(order);

            }
        })
    }
    
});


module.exports = router;
