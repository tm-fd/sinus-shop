const mongoose = require('mongoose');

const productsSchema = mongoose.Schema({
    title: String,
    price: Number,
    shortDesc:String,
    longDesc:String,
    imgFile:String,
});

const Products = mongoose.model('Products', productsSchema);

module.exports = Products;
