const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const productRoutes  = require('./api/routes/products');
const orderRoutes  = require('./api/routes/orders');
const userRoutes  = require('./api/routes/users');

mongoose.connect('mongodb://0.0.0.0:27017/node-rest-shop')

// handling CORS
app.use((req,res,next)=>{
res.header('Access-Control-Allow-Origin','*');
res.header('Access-Control-Allow-Headers',
'Origin, X-Requested-With, Content-Type, Accept, Authorization');
if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
}
next();
});

//logging
app.use(morgan('dev'));

// make uploads public 
app.use('/uploads',express.static('uploads'));

// parse any jsom coing from requests to objects
app.use(express.urlencoded({ extended: false}));
app.use(express.json()) 

// routing
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/users',userRoutes);

app.use((req,res,next)=>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});
app.use((err,req,res,next)=>{
    res.status(err.status || 500);
    res.json({
        error:{
            message : err.message 
        }
    })
})
module.exports = app;