const express = require('express');
const app = express();
const mongoose = require('mongoose');
//Product Model
const UserData = require('../models/userSchema')

//const router = express.Router();


//post request
app.post("/signup",async (req, res) =>{

    res.json({message:"data successfully poat"})

    const postUserData = req.body;

    const UsersData = new UserData(postUserData)

    const saveDbUser = await UsersData.save()

    if(saveDbUser){
        console.log("data has been successfully saved on db")
    }else{
        console.log("failed data saved")
    }

})