const express = require("express")
const connectDB = require("./config/database")
const cors = require("cors")
const app = express()

//socket.io first thing we need to import it from http
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
const chatRouter = require("./routes/chat")


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter)
app.use("/", chatRouter)
 
//2nd step we need to create the server
const server = http.createServer(app)
initializeSocket(server)





connectDB()
    .then(() => {
        console.log("Database connection extablished")
        // 3rd server.listen
        server.listen(process.env.PORT, () => {
            console.log("Server is running ")
        })
    })
    .catch(() => {
        console.log("Error connecting to the database")
     })
