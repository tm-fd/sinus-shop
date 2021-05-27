const { Router } = require('express');
const router = new Router();

const { JoiValidateProduct } = require('../controller/validationController');
const authorizationMiddleware = require('../controller/authorization');

const Product = require('../models/product');
const User = require('../models/user');

const mongodb = require('mongodb');
let ObjectId = mongodb.ObjectId;

const cookieParser = require('cookie-parser');
router.use(cookieParser());

require('dotenv').config();



// Visa alla produkter till användaren oavsett om hen är inloggad eller inte
router.get('/', async (req,res) => {
    
    // Här skapar vi en variabel som letar efter alla produkter som finns i vår databas och sedan skickar dem
    const products = await Product.find({})
    if (products) {
        res.status(200).send(products)
    } else {
        res.status(401).send("Bad request")
    }
        
});


//Post a new product
router.post('/', authorizationMiddleware, async (req,res) => { // authorizationMiddleware kontrolleras om token är stämmer, annars visa upp ett error meddelande
    
    /* Lägger till funktionen för Joi som tar in den request som kommer från 
    användaren och stämmer av de kriterier som lagts i funktionen. Om det är något 
    som inte stämmer skickas ett meddelande från details som 
    förklarar vad som inte stämmer */
    const { error } =  JoiValidateProduct(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Här skapar vi en variabel som letar efter om användaren har loggat in som admin eller som customer
    const user = await User.findOne({ role: req.decodedToken.user.role })

    // Vi kontrollerar ifall man loggat in som admin, så ska hen kunna skapa en ny produkt och spara en i vår databasen, annars kommer ett meddelande att dyka upp som säger att ( 'Only admin can makes changes')
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

    // Ifall man skrev ett fel ID av produkten så kommer att visa upp ett meddelande som säger ('No such product found')
    if(!ObjectId.isValid(req.params.id)){
        return res.send('No such product found')
    }else{
        const product = await Product.findById(req.params.id)
        res.send(product)        
    }
});


//Update a product based on id
router.patch('/:id', authorizationMiddleware,async (req, res) => {

    const { error } =  JoiValidateProduct(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ role: req.decodedToken.user.role })

    // Vi kontrollerar ifall man loggat in som admin, så ska hen kunna uppdatera en produkt baserat på ID, annars kommer ett meddelande att visa upp som säger att ('Only admin can makes changes')
    if( user.role === 'admin'){

        // Ifall man skrev ett fel ID av produkten så kommer att visa upp ett meddelande som säger (`Error: Invalid product's ID`)
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

    // Vi kontrollerar ifall man loggat in som admin, så ska hen kunna radera en produkt baserat på ID, annars kommer ett meddelande att visa upp som säger att ('Only admin can makes changes')
    if( user.role === 'admin'){

        // Ifall man skrev ett fel ID av produkten så kommer att visa upp ett meddelande som säger (`Error: Invalid product's ID`)
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
