const router = require('express').Router();
const User = require('../models/user');
const Order = require('../models/order');
const Product = require('../models/product');

const cookieParser = require('cookie-parser');
router.use(cookieParser());
const jwt = require('jsonwebtoken');

require('dotenv').config()

router.get('/api/orders', async (req, res) => {
    // kollar om det inte finns inloggad person.
    if (!req.cookies['auth-token']) {
        res.send("Bara för inloggade.")
    } else {
        const token = req.cookies['auth-token'];
        // verifierar token.
        jwt.verify(token, process.env.SECRET, async (err, payload) => {
            const user = await User.findOne({ name: payload.user.name })
            if (err) {
                res.json(err)
            } else {
                // ifall admin är inloggad då ser den alla ordrar. Om det är en kund så ser den bara själva beställingar personen gjort.
                if (user.role === 'admin') {
                    const orders = await Order.find();
                    res.json(orders);
                } 
                else if(user.role === 'customer') {
                    const user = await User.findOne({ name: payload.user.name }, { orderHistory: 1 }).populate('orderHistory');
                    res.json(user.orderHistory);
                }
            }
        })

    }
});

router.post('/api/orders', async (req, res) => {

    // kollar om det inte finns inloggad person.
    if (!req.cookies['auth-token']) {
        res.send("Bara för inloggade.")
    } else {
        const token = req.cookies['auth-token'];

        // verifierar token.
        jwt.verify(token, process.env.SECRET, async (err, payload) => {
            if (err) {
                res.json(err)


            } else {
                const user = await User.findOne({ name: payload.user.name })
                let items = req.body.items;
                
                // kollar ifall det inte finns några varor i varukorgen, då skapas det inga ordrar.
                (items === undefined || items === null || items.length === 0 ) ?  res.status(404).send('FEL') : res.status(200).json(items)
                
                // den kollar i produkt modelen och checkar ifall rätt id till produkt matchar inne i items i order model.
               // let allProducts = await Product.find({ _id: { $in: items }});

                ////////////////////////////////////////////////////////////////////
                // get price for each product in the order, then return sum
                async function orderSum(productsArray) {
                    let totalSum = 0;
                    // find matching products by comparing all products and pruducts in the order 
                    try {
                        let products = await Product.find();
                        for (let i = 0; i < products.length; i++) {
                            for (let x = 0; x < productsArray.length; x++) {
                                if (products[i]._id == productsArray[x]) {
                                    totalSum += products[i].price
                                }
                            }
                        }
                       
                       return totalSum
                    } catch (error) {
                        return error
                    }
                }

                const sumResult = await orderSum(req.body.items)
                console.log(sumResult)
                //////////////////////////////////////////////////////////////  


                let order = new Order({
                    timeStamp: Date.now(),
                    status: true,
                    items: items,
                    orderValue: sumResult

                });
                // Skapar order och lägger till den i new Order.
                await Order.create(order);
            
                // den hittar rätt user med id och uppdaterar personens orderHistory.
                const result = await User.findByIdAndUpdate(user._id, { $push: { orderHistory: order._id } });

               // res.json(order);
            }
        })
    }
});


module.exports = router;
