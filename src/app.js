// just checking is it working perfect or not 
require("dotenv").config();
const express = require("express")
const connectDB = require("./config/database")
const cors = require("cors")
const app = express()


const cookieParser = require("cookie-parser")
const jwt= require("jsonwebtoken")

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"] 
}))
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
//     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     res.header("Access-Control-Allow-Credentials", "true");
    
//     if (req.method === "OPTIONS") {
//         return res.sendStatus(204);
//     }
//     next();
// });

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
 




connectDB()
    .then(() => {
        console.log("Database connection extablished")
        app.listen(process.env.PORT, () => {
            console.log("Server is running ")
        })
    })
    .catch(() => {
        console.log("Error connecting to the database")
     })
