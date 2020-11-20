var mongoose = require('mongoose')
var   ProductsSchema = mongoose.Schema({
    id: Number,
    title: String,     
    price: Number,
    description: String,
    category: String,
    image: String
})

module.exports = mongoose.model('Products', ProductsSchema, 'products')