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
app.use(express.json())

 
app.post("/signup", async(req, res)=>{
const user = new User(req.body)

try{
  await user.save()
  res.send("user added successfully")
  console.log(user)
}
catch(err){
  res.status(400).send("error saving details"+err.message)
}
})
app.get("/user",async(req, res)=>{
    const userEmail = req.body.emailId;

    try{
        console.log(userEmail)
        const user = await User.findOne({emailId:userEmail})
        if(!user){
            res.status(404).send("user not found")
        }
        else{
            res.send(user)
        }  
    }
    catch{
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
app.delete("/user", async(req, res)=>{
    const userId = req.body.userId
    try{
        const user = await User.findByIdAndDelete(userId)
        res.send("User deleted suceesfully")

    }catch{
   res.status(400).send("you can not do that ")
    }
})
app.patch("/user", async(req, res)=>{
    const userId = req.body.userId
    const data = req.body
    try{
        const user = await User.findOneAndUpdate({_id:userId},data)
        res.send("user updated suceesfully")
    }
    catch{
        res.status(400).send("you can not do that ")
    }
})
app.put("/user", async(req, res)=>{
    const userId = req.body.userId 
    const data = req.body
    try{
        const user = await User.findOneAndUpdate({_id:userId},data)
        res.send("user updated suceesfully")
    }
    catch{
        res.status(400).send("you can not do that ")
    }
})
connectDB()
.then(()=>{
    console.log("Database connection extablished")
    app.listen(port,()=>{
        console.log("Server is running ")
    })
})
.catch(()=>{
    console.log("Error connecting to the database")
})
     