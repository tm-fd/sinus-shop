const express = require('express')
const products = require('./routes/products');
const auth = require('./controller/authController')
const mongoose = require('mongoose');
const app = express()

app.use( express.static('public') )


// connect to mongodb & listen for requests
const dbURI = "mongodb+srv://Grin:projektgrin@grin.0ubep.mongodb.net/Grin_db?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(err => console.log(err));


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


 // Routes
app.use('/api/products', products);
app.use('/api/auth', auth);

module.exports = app