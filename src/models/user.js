const mongoose = require("mongoose")
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required:true,
        minLength:4
    }, 
    lastName:{
        type:String
    },
    emailId:{
    type: String,
    required:true
    },
    password:{
        type:String,
        required:true
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
        default:"https://www.shutterstock.com/image-vector/isolated-object-avatar-dummy-symbol-260nw-1290296656.jpg"
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