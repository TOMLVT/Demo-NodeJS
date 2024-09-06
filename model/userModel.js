const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
     name : {
        type : String,
        required : [true , 'Please , Enter your name !'],
        unique : true
     },
     email : {
        type : String,
        validate: [validator.isEmail], // check string fit email 
        required : [true , 'Please , Enter your email !'],
        unique : true,
        lowercase : true,  
     },

     photo : String,
     Password : {
        type: String,
        required : [true , 'Please , Enter your password !'],
        minLength : 8
     },

     confirmPassword : {
        type : String,
        required : [true , 'Please , confirm your password !'],
     }

})

const User = mongoose.model('User' , userSchema)
module.exports = User
