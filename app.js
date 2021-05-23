const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Imported Routes
const products = require('./routes/products');
const auth = require('./controller/authController');
const users = require('./routes/register');
const order = require('./routes/orders');

// Connect to mongodb & listen for requests
const dbURI = "mongodb+srv://Grin:projektgrin@grin.0ubep.mongodb.net/Grin_db?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
  .catch(err => console.log(err));


// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


 // Routes Middleware
app.use('/api/products', products);
app.use('/api/auth', auth);
app.use('/api/register', users);
app.use('/', order);



module.exports = app;