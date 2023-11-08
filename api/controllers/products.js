const Product = require('../models/product');
const mongoose = require('mongoose');

exports.products_get_all = (req,res,next)=>{
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
        const response ={
          count : docs.length,
          data : docs.map(doc =>{
            return {
                name : doc.name,
                price : doc.price,
                _id : doc._id,
                productImage : doc.productImage,
                request :{
                    type : 'GET',
                    url : 'http://localhost:3000/products/'+ doc._id
                } 
            }
          }) 
        };
      res.status(200).json(response)
    })
    .catch(err =>{
        res.status(500).json({error:err})
    });
}
 exports.products_add_one = (req,res,next)=>{
    console.log(req.file)
const product = new Product({
    _id : new mongoose.Types.ObjectId(),
    name : req.body.name,
    price : req.body.price,
    productImage : req.file.path
});
product.save().then(result =>{
    console.log(result);
    res.status(201).json({
        data : {
            name : result.name,
            price : result.price,
            _id : result._id,
            request :{
                type : 'GET',
                url : 'http://localhost:3000/products/'+ result._id
            } 
        }
    })
})
.catch(err => {
    console.log(err);
    res.status(500).json({
        error: err
    })
})
    }

    exports.product_get_one = (req,res,next)=>{
        const id = req.params.productId;
        Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc=> {
            if(doc)
            res.status(200).json({
                data: doc,
                request : {
                    type : 'GET',
                    description : 'to get all products',
                    url : 'http://localhost:3000/products'
                }
            });
        else 
        res.status(404).json({message: 'No valid entry found for provided ID'});
        })
        .catch(err=> {
            console.log(err);
            res.status(500).json({message: err})
        });
       }

       exports.products_update_one = (req,res,next)=>{
        const id = req.params.productId;
        const updateOps = {};
        for(const ops of req.body){
            updateOps[ops.propName] = ops.value;
        }
        console.log(updateOps)
        Product.updateOne({_id : id }, { $set : updateOps})
        .exec()
        .then(result => {
            res.status(200).json({
                data: result.acknowledged,
                request :{
                    type : 'GET',
                    url : 'http://localhost:3000/products/'+id
                } })
        })
        .catch(err => {
        res.status(500).json({message: err})
    })
       }

       exports.products_delete_one = (req,res,next)=>{
        const id = req.params.productId;
        Product.deleteOne({_id : id })
        .exec()
        .then(result => {
            res.status(200).json({ data: result.acknowledged});
        })
        .catch(err =>{
            res.status(500).json({error:err}); 
        })
       }