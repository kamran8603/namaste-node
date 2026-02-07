 const validator = require("validator");

 const validateSignUpData=(req)=>{
    const {firstName, lastName, emailId, password}= req.body;
    if(!firstName || !lastName){
        throw new Error("Name is Not valid")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("email is invalid ")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("password is not strong")
    }
 }
 module.exports= {
    validateSignUpData,
 }