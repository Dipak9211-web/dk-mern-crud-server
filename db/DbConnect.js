require('dotenv').config()
const mongoose = require('mongoose');
const username = process.env.DB_USER_NAME
const URL = `mongodb+srv://${username}:${username}@cluster0.mw7ge1c.mongodb.net/${process.env.DB_COLLECTION_NAME}?retryWrites=true&w=majority`
 mongoose.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true}, (err)=>{
    if(err){
        console.log("unable to connect the database")
        console.log(err)
    }else{
        console.log("successfully connected to the database")
    }
 })