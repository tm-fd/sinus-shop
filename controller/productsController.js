const {Router} = require('express')
const Product = require('../model/product')

const router = new Router()


router.get('/', async (req,res) => {
    let products = await Product.find({})
    res.json(products)
})

router.put('/:putId', (req, res) => {
    Product.findByIdAndUpdate({_id: req.params.putId}, req.body).then( () => {
        Product.findOne({_id: req.params.putId}).then( (products) => {
            res.send(products)
        })
    })
})


// router.patch('/:patchId', async (req, res) => {

//     const product = await Product.findByIdAndUpdate(req.params.patchId).exec();
//     let query = {$set: {}}

//     for( key in req.body ){
//         if(product[key] && product[key] !== req.body[key])
//         query.$set[key] = req.body[key];

//         const updatedProduct = await Product.updateOne({_id: req.params.patchId, query}).exec();
//         console.log(updatedProduct)
//         res.send(product)

//     }

// })


router.delete('/:deleteId', (req, res) => {
    Product.findByIdAndRemove({_id: req.params.deleteId}).then( (deletedProduct) => {
        res.send(deletedProduct)
    })
})

// -1 Jag ska hitta en lösning till patch
// -2 Jag ska försöka att göra om metoder till async

module.exports = router;