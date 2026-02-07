// const express = require("express")
// const app = express()
// const port = 7777



// // this will handle to get the user
// app.get("/user",(req, res)=>{
//     res.send({firstname:"kamran", lastname:"haider"})
// })
// // this will post the data to the dab
// app.post("/user",(req, res)=>{
//     res.send("data store in db ")
// })
// // this will delete the data from the db
// app.delete("/user",(req, res)=>{ 
//     res.send("data deleted successully")
// })
// // this api call for partial modification
// app.patch("/user",(req, res)=>{
//     res.send("data is partially delted")
// })
// //this is used to delete the full record
// app.put("/user", (req, res)=>{
//     res.send("data is deleted permanantelly")
// })

// // next topic 
// app.get(/^\/ab*c$/, (req, res) => {
//     res.send("data is getting from the database")
// })

// app.listen(port,()=>{
//     console.log("server is running")
// })


// middleware and errors

// const express = require("express")
// const app = express()
// const port = 7777

// // this is basically usedto handled the error by using next callback function

// app.use("/user",(req, res,next)=>{
//     console.log("handling te route user")
//     next()
// },
// (req,res,next)=>{
//     console.log("handling the route user 2")
//     next()
// },
// (req, res, next)=>{
//     console.log("handling req the route user 3")
//     next()
// },
// (req, res, next)=>{
// console.log("handling request 4")
// res.send("hello i am response")
// }
// )

// app.listen(port,()=>{
//     console.log("server is running")
// })


// database and sehemas

const express = require("express")
const connectDB = require("./config/database")
const app = express()
const port = 7777
const User = require("./models/user")
const { validateSignUpData }= require("./utils/validation")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt= require("jsonwebtoken")
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
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(isPasswordValid){

            //create a jwt token
            const token = await jwt.sign({ _id:user._id}, "secretkey")
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

app.get("/profile",async(req, res)=>{

    try{
        //extract the cookie 
        const cookies = req.cookies
        const {token}= cookies
        if(!token){
            throw new Error("Invalid token")
        }
        // here it will verify the user is correct or not 
        const decodeMesage = await jwt.verify(token, "secretkey")
        // get the id from token
        const {_id}=decodeMesage;
        console.log("Logged in user is "+ _id)
        const user = await User.findById(_id)
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
app.delete("/user", async (req, res) => {
    const userId = req.body.userId
    try {
        const user = await User.findByIdAndDelete(userId)
        res.send("User deleted suceesfully")

    } catch {
        res.status(400).send("you can not do that ")
    }
})
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId
    const data = req.body;

    try {
        const ALLOWED_UPDATE = ["photoUrl", "about", "gender", "skills", "age"];
        const isUpdate = Object.keys(data).every((k) => 
            ALLOWED_UPDATE.includes(k)
    )
        if (!isUpdate) { 
          throw new Error("update not allowed")
        }
        const user = await User.findByIdAndUpdate({ _id: userId }, data)
        res.status(200).send("user updated suceesfully")
        console.log("user update successfully", user)
    }
    catch(err) {
        res.status(400).send("you can not do that ")
    }
})


app.put("/user", async (req, res) => {
    const userId = req.body.userId
    const data = req.body
    try {
        const user = await User.findOneAndUpdate({ _id: userId }, data)
        res.send("user updated suceesfully")
    }
    catch {
        res.status(400).send("you can not do that ")
    }
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
