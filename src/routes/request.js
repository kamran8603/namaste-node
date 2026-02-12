const express = require("express")
const requestRouter = express.Router()
const {userAuth} = require("../middleware/auth")

requestRouter.post("/sendConnectionRequest",userAuth, async(req, res)=>{
    const user = req.user
    //if we want to check which user send me the request then we can extract and send alond with the response
    res.send(user.firstName +" successfully send the connection request ")
    console.log("seuccesfully send the connection")

})
module.exports=requestRouter;