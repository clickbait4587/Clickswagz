var express = require('express');
var router = express.Router();
var fs = require('fs'), path = require('path')
const axios = require('axios');
/*  GET products */
const mongoose = require('mongoose'), Cart = require('../models/cart'), Products = require('../models/products'), mongoURI =
  "mongodb+srv://squashetonics:TPWbUdSRFfNVmnQM@cluster0.bdkny.mongodb.net/clickbeats?retryWrites=true&w=majority";
mongoose.connect(mongoURI, {useUnifiedTopology: true,useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', (err)=>console.log(err.messages))

db.once('open', ()=>{
console.log('Mongo Connected')

/* GET home page. */
var songs =  require('../controllers/songs')
const ax = axios.get("https://fakestoreapi.com/products")
Products.find({},(err, prods)=>{
  router.get('/', function(req, res, next) {
    if(!req.user) res.redirect('/login')
  res.status(200).render('index', {
    data: prods,
    user: req.user,
})
  })
  
})
})
let dirs = fs.readdirSync('views')
   dirs.forEach(dir=>{
  router.get(`/${dir.split('.')[0]}`, (req,res,next)=>{
    //res.writeHead(200)
    res.status(200).render(dir,{
      me: 'Khaya'
    })
  })
})
module.exports = router;
