const Products = require('../models/products')
const express = require("express");
const router = express.Router();

router.get('/', (req, res)=>{
    Products.find({}, (err, products)=>{
        if (err) console.log(err.message)
        res.send(products)
    })
})
module.exports = router