const mongoose = require('mongoose') //import mongoose
mongoose.set('strictQuery', false);


//using mongoose define a connection string
mongoose.connect('mongodb://localhost:27017/bankDB',()=>{
    console.log('mongo db connected successfully');
})

//creat model  for the projects
const User = mongoose.model('User',{
    usname:String,
    acno:Number,
    password:String,
    balance:Number,
    transactions:[]
})

//export moddel
module.exports={
    User
}