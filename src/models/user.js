const validator = require("validator")
const mongoose = require("mongoose")
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required:true,
        minLength:4,
        maxLength:50
    }, 
    lastName:{
        type:String
    },
    emailId:{
    type: String,
    required:true,
    validate(value){
        if(!validator.isEmail(value)){
            throw new Error("email is invalid "+ value)
        }
    }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error(value)
            }
        }
    },
    age:{
        type: Number,

    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female", "others"].includes(value)){
                throw new Error("gender not define")
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://www.shutterstock.com/image-vector/isolated-object-avatar-dummy-symbol-260nw-1290296656.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("URL  is invalid "+ value)
            }
        }
    },
    about:{
        type:String ,
        default :"this is default value of the user"
    },
    skills:{
     type:[String]
    }

});
const userModel = mongoose.model("User", userSchema)
module.exports=userModel