const User = require("../models/user");
const mongoose = require("mongoose");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.users_signup = (req, res, next) => {
    User.find({email : req.body.email})
         .exec()
         .then((user)=>{
            if(user.length >=1){
              res.status(409).json({ message : "email exist before"})
            }
            else{
              bcryptjs.hash(req.body.password, 10 , (err,hash)=>{
                if(err){
                 return res.status(500).json({
                   error : err
                 });
                }
                else {
                  const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: hash
                    });
                  user.save()
                      .then((result) => {
                      res.status(201).json({
                      data: {
                        email: result.email,
                        password: result.password,
                        _id: result._id,
                        request: {
                          type: "GET",
                          url: "http://localhost:3000/users/" + result._id,
                        },
                      },
                    });
                  })
                  .catch((err) => {
                    res.status(500).json({
                      error: err,
                    });
                  });
                }
             
              });
            }
         })
  }

  exports.users_login = (req,res,next)=>{
    User.find({email : req.body.email})
    .exec()
    .then((user)=>{
       if(user.length < 1){
         return res.status(401).json({ message : 'Auth failed'})
       }
       else{
         bcryptjs.compare(req.body.password, user[0].password,(err,result)=>{
              if(err){
               return res.status(401).json({ message : 'Auth failed'})
              }
              if(result){
               const token = jwt.sign({
                 email : user[0].email,
                 _id : user[0]._id
               },
                process.env.JWT_Key ,
                {
                 expiresIn :  "1hour"
                }
                 )
               res.status(200).json({
                 message : ' Auth successfull',
                 token : token
               })
              }
              return res.status(401).json({ message : 'Auth failed'})
         })
       }})
       .catch((err)=>{
         res.status(500).json({
           error: err,
         });
       })
 }
 exports.users_delete_one = (req,res,next)=>{
    const id = req.params.userId;
    User.deleteOne({_id : id })
    .exec()
    .then(result => {
        res.status(200).json({ data: result.acknowledged});
    })
    .catch(err =>{
        res.status(500).json({error:err}); 
    })
   }