const authorizationMiddleware = require('../controller/authorization')
const { Router } = require('express');
const Product = require('../models/product');
const { JoiValidateProduct } = require('../controller/validationController')
const User = require('../models/user');
const router = new Router();
const mongodb = require('mongodb')
let ObjectId = mongodb.ObjectId
const cookieParser = require('cookie-parser');
require('dotenv').config()

router.use(cookieParser());

//Show all products
router.get('/', async (req,res) => {
    const products = await Product.find({})
    res.send(products)
});


//Post a new product
router.post('/', authorizationMiddleware, async (req,res) => {

    const user = await User.findOne({ role: req.decodedToken.user.role })

    if( user.role === 'admin'){

        let product = new Product({ 
            title: req.body.title,
            price: req.body.price,
            shortDesc: req.body.shortDesc,
            longDesc: req.body.longDesc,
            imgFile: req.body.imgFile
        })
    
        await product.save( (err) => {
            if(err){
                res.send(err.message)
            }else{
                res.send(product)           
            }
        })

    }else if( user.role === 'customer'){
        res.send('Only admin can makes changes')
    }
});


//Show product by id
router.get('/:id', async (req,res) => {
    if(!ObjectId.isValid(req.params.id)){
        return res.send('No such product found')
    }else{
        const product = await Product.findById(req.params.id)
        res.send(product)        
    }
});


//Update a product based on id
router.patch('/:id', authorizationMiddleware,async (req, res) => {

    const user = await User.findOne({ role: req.decodedToken.user.role })

    if( user.role === 'admin'){

        if(!ObjectId.isValid(req.params.id)){
            return res.send(`Error: Invalid product's ID`)
        }else{
            const patchedProduct = await Product.findByIdAndUpdate( req.params.id, req.body, {
                new: true
            })
            res.send(patchedProduct)        
        }

    }else if( user.role === 'customer'){
        res.send('Only admin can makes changes')
    }
});


//Delete a product based on id
router.delete('/:id', authorizationMiddleware, async (req, res) => {

    const user = await User.findOne({ role: req.decodedToken.user.role })

    if( user.role === 'admin'){

        if(!ObjectId.isValid(req.params.id)){
            return res.send(`Error: Invalid product's ID`)
        }else{

            await Product.findByIdAndRemove( {_id: req.params.id}, (err, doc) => {
                if(err){
                    res.send({ error: "Something failed!" });
                }else{
                    res.send(doc)
                }
            })
        }

    }else if( user.role === 'customer'){
        res.send('Only admin can makes changes')
    }

});

module.exports = router;
