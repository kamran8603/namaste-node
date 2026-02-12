// just checking is it working perfect or not 

const express = require("express")
const connectDB = require("./config/database")
const app = express()
const port = 7777
const User = require("./models/user")
const { validateSignUpData }= require("./utils/validation")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt= require("jsonwebtoken")
const {userAuth} = require("./middleware/auth")
app.use(express.json())
app.use(cookieParser() )

app.post("/signup", async (req, res) => {
    try {
           //FIRST STEP validate the data first
           validateSignUpData(req)

           // after validation of data now we can extract it 

           const {firstName, lastName,emailId, password}= req.body

           //after the encrypt the password  then save it  
            const passwordHash = await bcrypt.hash(password, 10)
            console.log(passwordHash)

        //    this is the instance of the user model
           const user = new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash 
           })
        // now you can save user in the db  
        await user.save()
        res.send("user added successfully")
        console.log(user)
    }
    catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }
})
app.post("/login",async(req, res)=>{
    try{
        // step 1 it will extract email 
        // and passwod because it is login we need two things
        const {emailId, password}= req.body

        // step 2 it will find the emailId from database
        const user = await User.findOne({emailId: emailId})
        if(!user){
            throw new Error("user is not presnet in teh database")
        }
        //step 3 it will compare the password fro hased that user will
        // give correct password or not
        const isPasswordValid = await user.validatePassword(password)
        if(isPasswordValid){

            //create a jwt token
            const token = await user.getJWT()
            console.log(token)
            //add the token to cookie and send the response
            res.cookie("token",token)
            res.send("Login Successfull")
        }else{
            throw new Error("Password is not valid")
        }

    }catch(err){
res.status(400).send("ERROR : " + err.message)
    }
})

app.get("/profile",userAuth,async(req, res)=>{

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

app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;

    try {
        console.log(userEmail)
        const user = await User.findOne({ emailId: userEmail })
        if (!user) {
            res.status(404).send("user not found")
        }
        else {
            res.send(user)
        }
    }
    catch {
        res.status(400).send("something went wrong")
    }
    // try{
    //     console.log(userEmail)
    //     const users =await User.find({emailId:userEmail})
    //     if(!users){
    //         res.status(404).send("User not found")

    //     }else{
    //         res.send(users)
    //     }

    // }
    // catch(err){
    //    res.status(400).send("something went wro ng")
    // }
})

app.post("/sendConnection",userAuth, async(req, res)=>{
        const user = req.user
        //if we want to check which user send me the request then we can extract and send alond with the response
        res.send(user.firstName +" successfully send the connection request ")
        console.log("seuccesfully send the connection")
   
})

connectDB()
    .then(() => {
        console.log("Database connection extablished")
        app.listen(port, () => {
            console.log("Server is running ")
        })
    })
    .catch(() => {
        console.log("Error connecting to the database")
     })
