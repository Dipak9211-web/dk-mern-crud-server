require('dotenv').config()
const mongoose = require('mongoose');
const username = process.env.DB_USER_NAME
const adminpassword = process.env.DB_PASSWORD
const URL = `mongodb+srv://${username}:${adminpassword}@cluster0.jmu49dr.mongodb.net/${process.env.DB_COLLECTION_NAME}?retryWrites=true&w=majority`
 mongoose.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true}, (err)=>{
    if(err){
        console.log("unable to connect the database")
        console.log(err)
    }else{
        console.log("successfully connected to the database")
    }
 })