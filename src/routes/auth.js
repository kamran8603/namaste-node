const express = require("express")
const authRouter = express.Router()
const { validateSignUpData } = require("../utils/validation")
const User = require("../models/user")
const bcrypt = require("bcrypt")



authRouter.post("/signup", async (req, res) => {
    try {
        //FIRST STEP validate the data first
        validateSignUpData(req)

        // after validation of data now we can extract it 

        const { firstName, lastName, emailId, password,age,gender,about,skills } = req.body

        //after the encrypt the password  then save it  
        const passwordHash = await bcrypt.hash(password, 10)
        

        //    this is the instance of the user model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
           
        })
        // now you can save user in the db  
      const savedUser =   await user.save()

        const token = await savedUser.getJWT()
           
            //add the token to cookie and send the response
            res.cookie("token", token,{
                expires:new Date(Date.now()+ 8 * 3600000),
            })

        res.json({message:"User Added successfully",data:savedUser})
        
    }
    catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        // step 1 it will extract email 
        // and passwod because it is login we need two things
        const { emailId, password } = req.body

        // step 2 it will find the emailId from database
        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            throw new Error("user is not presnet in teh database")
        }
        //step 3 it will compare the password fro hased that user will
        // give correct password or not
        const isPasswordValid = await user.validatePassword(password)
        if (isPasswordValid) {

            //create a jwt token
            const token = await user.getJWT()
            
            //add the token to cookie and send the response
            res.cookie("token", token,{
                expires:new Date(Date.now()+ 8 * 3600000),
            })
            res.send(user)
        } else {
            throw new Error("Password is not valid")
        }

    } catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }
})
authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    res.send("Logout successfull")
})

module.exports = authRouter 