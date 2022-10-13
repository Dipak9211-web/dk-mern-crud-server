require('dotenv').config()
const express = require('express');
const app = express()
const mongoose = require('mongoose');
const cors = require('cors');
 const port = process.env.PORT || 8000
//db conncetion
require("./db/DbConnect");

//json web token(jwt)
const Jwt = require('jsonwebtoken')
const jwtKey = process.env.SECRET_KEY

//Product & User Model
const UserData = require('./models/userSchema');
const ProductData = require('./models/productSchema')

//used as a middleware
app.use(express.json());
app.use(cors())

//router
//require("./routes/auth")

app.post('/signup', async(req, res) =>{
   
    let postUserData = req.body;
    let UsersData = new UserData(postUserData)
    let saveDbUser = await UsersData.save()//data saved in databse//also we will get that data in saveDbUser

    saveDbUser = saveDbUser.toObject()//saveDbUser will convert into object from so we can delete the password because we do not want to show the password to the user
    delete saveDbUser.password //means password will be deletecd

    Jwt.sign({saveDbUser},jwtKey,{expiresIn:"12h"}, (err, token)=>{
        if(err){
            res.send({message:"something went wrong , please try after sometime"})
        }
        res.send( {saveDbUser, auth:token})
    })
    if(saveDbUser){
        console.log("data has been successfully saved on db")
    }else{
        console.log("failed data saved")
    }

});

app.post("/login", async(req, res)=>{
    if(req.body.email && req.body.password){
       let user = await UserData.find(req.body).select("-password")
       if(user.length>0){
        Jwt.sign({user},jwtKey,{expiresIn:"2h"}, (err, token)=>{
            if(err){
                res.send({message:"something went wrong , please try after sometime"})
            }
            res.send( {user, auth:token})
        })
        
        console.log(user)
       }else{
        res.send({message:"no user found"})
       }
    }
})

//route for product model
app.post("/add-product",vaerifyToken, async(req, res)=>{
    let postProductData = req.body;
    if(postProductData.name && postProductData.price && postProductData.userId && postProductData.company){
        let ProductsData = new ProductData(req.body)
        let result = await ProductsData.save();
        res.send(result)
    }else{
        res.json({message:"fill all form field properly"})
        console.log("fill all form field")
    }
    
  
});

app.get("/products",vaerifyToken, async(req, res)=>{
    let products = await ProductData.find();
    if(products.length>0){
      res.send(products)
    }else{
        res.send({result:"no product found"})
    }
});
//api for delete one product
app.delete("/product/:id",vaerifyToken, async(req, res)=>{
    const result = await ProductData.deleteOne({_id:req.params.id})
    res.send(result)
});
//api for get one product from the products collection// here our routes is same as above route but we can use it but condition is method should be different
app.get("/product/:id",vaerifyToken, async(req, res)=>{
    let result = await ProductData.findOne({_id:req.params.id});
    if(result){
        res.send(result)
    }
    
});

//api for update one product useing put method
app.put("/product/:id",vaerifyToken, async(req, res)=>{
    let result = await ProductData.updateOne(
        {_id:req.params.id}, {$set: req.body}
    )
    res.send(result)
});

//search api for products
app.get("/search/:key", vaerifyToken, async(req, res)=>{
   let result = await ProductData.find({
       "$or":[
            {name:{$regex:req.params.key}},
            {company:{$regex: req.params.key}},
            {category:{$regex: req.params.key}}
       ]
   })
   res.send(result)
});
//varify token
function vaerifyToken(req, res, next){
    let token = req.headers['authorization']//authorization should be in small leters//getting token from the client
   if(token){
    token = token.split(' ')[1];

    Jwt.verify(token, jwtKey, (err, valid)=>{
        if(err){
            res.status(403).send({message:"plaese provide valid token"})
        }else{
            next();
        }
    })
   }else{
    res.status(401).send({message:"plaese add token with header"})
   }
   
}

app.listen(port, (err)=>{
   // console.log(err)
    console.log("server running on port 8000")
})