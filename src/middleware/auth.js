const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth = async(req, res, next)=>{
    try{
        //extract the cookie 
        const {token}= req.cookies;
        if(!token){
          return res.status(401).send("Please Login")
        }
       // here it will verify the user is correct or not 
        const decodeObj = await jwt.verify(token, "secretkey")
        // get the id from token
        const {_id}= decodeObj
        const user = await User.findById(_id)

        if(!user){
            throw new Error("User not found")
        }
        req.user = user
        next()

    }
    catch(err){
     res.status(400).send("ERROR :"+ err.message)
    }
}
module.exports = {
    userAuth
}