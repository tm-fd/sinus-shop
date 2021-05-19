const router = require('express').Router();
const Product = require('../model/product')

router.get('/', async (req,res) => {
    let products = await Product.find({})
    res.json(products)
});

router.post('/', async (req,res) => {

    let product = new Product({ 
        title: req.body.title,
        price: req.body.price,
        shortDesc: req.body.shortDesc,
        longDesc: req.body.longDesc, 
        imgFile: req.body.imgFile
    })

   product = await product.save()
   res.send(product)
});
module.exports =router;
