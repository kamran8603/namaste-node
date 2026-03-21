

const express = require("express")
const connectDB = require("./config/database")
const cors = require("cors")
const app = express()
const http = require("http")
require("dotenv").config();
// require("./utils/cronjob")


const cookieParser = require("cookie-parser")
const jwt= require("jsonwebtoken")

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"] 
}))

app.use(express.json())
app.use(cookieParser() )


const authRouter = require("./routes/auth")
const profileRouter =require("./routes/profile")
const requestRouter = require ("./routes/request")
const userRouter = require("./routes/user")
const initializeSocket= require("./utils/socket")


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter)
 
const server = http.createServer(app)
initializeSocket(server)



connectDB()
    .then(() => {
        console.log("Database connection extablished")
        server.listen(process.env.PORT, () => {
            console.log("Server is running ")
        })
    })
    .catch(() => {
        console.log("Error connecting to the database")
     })
