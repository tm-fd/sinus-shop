const authorizationMiddleware = require('../controller/authorization')
const router = require('express').Router();
const User = require('../models/user');
const Order = require('../models/order');
const Product = require('../models/product');

const cookieParser = require('cookie-parser');
router.use(cookieParser());

require('dotenv').config()

router.get('/api/orders', authorizationMiddleware, async (req, res) => {
    
            const user = await User.findOne({ name: req.decodedToken.user.name })
                // ifall admin är inloggad då ser den alla ordrar. Om det är en kund så ser den bara själva beställingar personen gjort.
                if (user.role === 'admin') {
                    const orders = await Order.find();
                    res.json(orders);
                } 
                else if(user.role === 'customer') {
                    const user = await User.findOne({ name: req.decodedToken.user.name}, { orderHistory: 1 }).populate('orderHistory');
                    res.json(user.orderHistory);
                }
            
    
});

router.post('/api/orders', authorizationMiddleware, async (req, res) => {
        
                const user = await User.findOne({ name: req.decodedToken.user.name})
                let items = req.body.items;
                
                // kollar ifall det inte finns några varor i varukorgen, då skapas det inga ordrar. /* End the flow by return */
                if(items === undefined || items === null || items.length === 0 ) return res.status(404).send('Cart can not be empty') 
                

                ////////////////////////////////////////////////////////////////////
                // get price for each product in the order, then return sum
                async function orderSum(productsArray) {
                    let totalSum = 0;
                    try {
                        // find matching products by comparing all products and pruducts in the order 
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
                console.log(items)
                const sumResult = await orderSum(items)
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
                await User.findByIdAndUpdate(user._id, { $push: { orderHistory: order._id } });
                
                /************/
                /// sending response to client
                res.status(200).send('The order has successfully added')
    
});


module.exports = router;
