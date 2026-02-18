// just checking is it working perfect or not 

const express = require("express")
const connectDB = require("./config/database")
const app = express()
const port = 7777

const cookieParser = require("cookie-parser")
const jwt= require("jsonwebtoken")
app.use(express.json())
app.use(cookieParser() )


const authRouter = require("./routes/auth")
const profileRouter =require("./routes/profile")
const requestRouter = require ("./routes/request")
const userRouter = require("./routes/user")


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter)
 
// app.get("/user", async (req, res) => {
//     const userEmail = req.body.emailId;

//     try {
//         console.log(userEmail)
//         const user = await User.findOne({ emailId: userEmail })
//         if (!user) {
//             res.status(404).send("user not found")
//         }
//         else {
//             res.send(user)
//         }
//     }
//     catch {
//         res.status(400).send("something went wrong")
//     }
//     // try{
//     //     console.log(userEmail)
//     //     const users =await User.find({emailId:userEmail})
//     //     if(!users){
//     //         res.status(404).send("User not found")

//     //     }else{
//     //         res.send(users)
//     //     }

//     // }
//     // catch(err){
//     //    res.status(400).send("something went wro ng")
//     // }
// })



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
