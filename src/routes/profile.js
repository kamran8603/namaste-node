 const express = require("express")
 const profileRouter = express.Router()
 const {userAuth} = require("../middleware/auth")


 profileRouter.get("/profile/view",userAuth,async(req, res)=>{

    try{
       //user is coming from middleware (Authmiddleware)
        const user = req.user
        if(!user){
            throw new Error("user does not exist")
        }
        res.send(user)
        
    }catch(err){
        res.status(400).send("ERROR : " + err.message)
    }

    

})

profileRouter.patch("/profilr/edit", userAuth, async (req, res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error ("Invalid Edits request")
        }
        const loggedInUser = req.user
        console.log(loggedInUser)
    }
    catch(err){
        res.status(400).send("ERROR : "+ err.message)
    }
   
})
module.exports=profileRouter