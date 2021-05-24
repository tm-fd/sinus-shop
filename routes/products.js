const { Router } = require('express');
const Product = require('../models/product');
const router = new Router();
const mongodb = require('mongodb')
let ObjectId = mongodb.ObjectId

//Show all products
router.get('/', async (req,res) => {
    const products = await Product.find({})
    res.send(products)
});


//Post a new product
router.post('/', async (req,res) => {
    let product = new Product({ 
        title: req.body.title,
        price: req.body.price,
        shortDesc: req.body.shortDesc,
        longDesc: req.body.longDesc,
        imgFile: req.body.imgFile
    })

   product = await product.save( (err) => {
       if(err){
           res.send(err.message)
       }else{
           res.send(product)           
       }
   })
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
router.patch('/:id', async (req, res) => {
    if(!ObjectId.isValid(req.params.id)){
        return res.send(`Error: Invalid product's ID`)
    }else{
        const patchedProduct = await Product.findByIdAndUpdate( req.params.id, req.body, {
            new: true
        })
        res.send(patchedProduct)        
    }
});


//Delete a product based on id
router.delete('/:id', (req, res) => {
    if(!ObjectId.isValid(req.params.id)){
        return res.send(`Error: Invalid product's ID`)
    }else{
        Product.findByIdAndRemove({_id: req.params.id})
        .then( (deletedProduct) => { res.send(deletedProduct) })        
    }
});

module.exports = router;
