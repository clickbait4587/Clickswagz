var axios = require('axios');

exports.ax = axios.get("https://fakestoreapi.com/products").then(resp=>{
    return resp
});


