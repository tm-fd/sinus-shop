const express = require('express');
const productsController = require('./controller/productsController');
const mongoose = require('mongoose');
const app = express();

require('dotenv').config();


// connect to mongodb & listen for requests
const dbURI = `mongodb+srv://Grin:${process.env.PASSWORD}@grin.0ubep.mongodb.net/Grin_db?retryWrites=true&w=majority`;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(result => app.listen(3000, () => { console.log('DB connected...') }))
  .catch(err => console.log(err));


// Middleware
app.use( express.static('public') );
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


 // Routes
app.use('/api/productsController', productsController);


module.exports = app;