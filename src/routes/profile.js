 const express = require("express")
 const profileRouter = express.Router()
 const {userAuth} = require("../middleware/auth")
const {validateEditProfileData}= require("../utils/validation")

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

profileRouter.patch("/profile/edit", userAuth, async (req, res)=>{
    try{
        //  this validateeditprofile coming from utils function that wil valide you 
        // can edit some part from req.json matlab ek user ka jo jo info hai usme se 
        // kuch hi edit kr skte ho saara ka saara edit ni kr skte ho 
        if(!validateEditProfileData(req)){
            //agar tum passsowrd edit kr rhe ho tb to yhn error dega
            throw new Error ("Invalid Edits request")
        }
    //    user information store kiye loggedInUser me
        const loggedInUser = req.user
       
     // yh us array ke saare chiz ko le rha hai jo hum edit kr skte jo utils ke validation me likha ek array me paas
     //kiye hai usse hi sara kuch yeh paas kr rha aur check kr rha hai ki sensative info cannot be change 
        Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]))

        // uske data ko database me save kr dete hai after edits jaise name skills status ya jo bhi kuch ho 
       await loggedInUser.save()
        
        res.json({message:`{loggedInUser.firstName}, you profile updated successfully`,
    data:loggedInUser,
    })
    }
    catch(err){
        res.status(400).send("ERROR : "+ err.message)
    }
   
}) 
module.exports=profileRouter