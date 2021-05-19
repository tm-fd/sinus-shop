const { Router } = require('express');
const Product = require('../model/product');
const router = new Router();


//Show all products
router.get('/', async (req,res) => {

    const products = await Product.find({})
    res.send(products)
});


//Show product by id
router.get('/:id', async (req,res) => {

    const product = await Product.findById(req.params.id)
    res.send(product)
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

   product = await product.save()
   res.send(product)
});


//Update a product based on id
router.patch('/:patchId', async (req, res) => {

    const patchedProduct = await Product.findByIdAndUpdate( req.params.patchId, req.body, {
        new: true
    })
    res.send(patchedProduct)
});


//Delete a product based on id
router.delete('/:deleteId', (req, res) => {

    Product.findByIdAndRemove({_id: req.params.deleteId})
    .then( (deletedProduct) => { res.send(deletedProduct) })
});

module.exports = router;