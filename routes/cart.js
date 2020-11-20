var express = require('express');
const cart = require('../models/cart');
var router = express.Router();
var Cart = require('../models/cart'), mongoose = require('mongoose')
, mongoURI =
"mongodb+srv://squashetonics:TPWbUdSRFfNVmnQM@cluster0.bdkny.mongodb.net/clickbeats?retryWrites=true&w=majority",
Products = require('../models/products')
router.put('/', (req, res, next)=>{
    let title = req.body.title;
    Products.findOne({title:title}).then(item=> {
        let cart = new Cart({
            user: req.user.username,
            cart: item,
            id: item.id
        })
        Cart.findOne({id: cart.id}, (err,crt)=>{
            if (!crt){
                cart.save((err, cart)=>{
                    err ? console.log(err.message): console.log(`Item added to cart`);
                    res.send(cart.cart)
        
                })
            }
            else {console.log(crt+' Item already in cart')}
            
        })
        
    }).catch(err=>console.log(err.message))
})
router.get('/', (req, res)=>{
    Cart.find({user: req.user? req.user.username: 'joe'}, (err, cart)=>{
        if (err) console.log(err.message)
        //res.send(cart);
        let newCart = []
        cart.forEach(cart=>{
            newCart.push(cart.cart)
        })
        res.send(newCart)
    })

    router.patch('/', (req,res)=>{
        let title = req.body.title
        let id = parseInt(req.body.id)
      cart.findOneAndDelete({id}, (err,res)=>{
        if (err) console.log(err.message)    
        
        }).then(()=>{cart.find({},(err, cart)=>{
            console.log('delete cart')
            console.log(cart.length);
            let newCart = []
            cart.forEach(cart=>{
                newCart.push(cart.cart)
            })
            res.send(newCart)
        })})
        //res.status(200).send({msg:'deleted'})
    })

    router.delete('/', (req,res)=>{
        cart.deleteMany({user: req.user.username}, (err)=>{
            if (err) console.log(err.message);
            console.log('Cart cl');
            res.send([])
        })
    })
})

module.exports = router 