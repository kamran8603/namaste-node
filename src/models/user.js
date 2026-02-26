const validator = require("validator")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required:true,
        minLength:4,
        maxLength:50
    }, 
    lastName:{
        type:String,
        required:true
    },
    emailId:{
    type: String,
    lowercase:true,
    unique:true,
    required:true,
    trim:true,
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
        required:true,
        min:18

    },
    gender:{
        type:String,
        // enum:{
        //     values:["male", "female","others"],
        //     message:`{VALUES}is not a valid gender`
        // }
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
            if(!validator.isURL(value,{require_protocol:true})){
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

}, {timestamps:true,} );

// this is how we put index in our database
// userSchema.index({firstName:1})

userSchema.methods.getJWT= async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id}, "secretkey",{
        expiresIn:"7d",
    })
    return token
}

userSchema.methods.validatePassword= async function(passwordInputByUser){
    const user = this
    const passwordHash= user.password
    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        passwordHash
    )
    return isPasswordValid
}



const userModel = mongoose.model("User", userSchema)
module.exports=userModel