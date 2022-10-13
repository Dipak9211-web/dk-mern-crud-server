require('dotenv').config()
const URL = `${process.env.DB_URL}`
const mongoose = require('mongoose');
const dbfunction = async()=>{
  await mongoose.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true}, (err)=>{
        if(err){
            console.log("unable to connect the database")
            console.log(err)
        }else{
            console.log("successfully connected to the database")
        }
     })
}
dbfunction();
 