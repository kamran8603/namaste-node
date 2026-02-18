const express = require("express")
const userRouter = express.Router()
const { userAuth } = require("../middleware/auth")
const ConnectionRequest = require("../models/connectionRequest")


//get all the pending conection request for the loggedin user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const connectionRequests = await ConnectionRequest.find({
            //toUserId should be loggedIn userId
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName","lastName"])
         
        res.json({
            message: "data fetched successfully",
            data: connectionRequests,
        })
    }
    catch (err) {
        req.statusCode(400).send("ERROR :", err.message)
    }
})


module.exports = userRouter