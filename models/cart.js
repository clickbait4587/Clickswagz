var mongoose = require('mongoose')

const CartSchema = mongoose.Schema({
    cart: Object,
    user: String,
    id: Number
})

module.exports = mongoose.model('Cart', CartSchema, 'clickswags-cart')