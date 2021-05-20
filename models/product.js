const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    title: String,
    price: Number,
    shortDesc:String,
    longDesc:String,
    imgFile:String,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
