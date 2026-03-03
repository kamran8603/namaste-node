const express = require("express")
const userRouter = express.Router()
const { userAuth } = require("../middleware/auth")
const ConnectionRequest = require("../models/connectionRequest")

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";
const User = require("../models/user")
//get all the pending conection request for the loggedin user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const connectionRequests = await ConnectionRequest.find({
            //toUserId should be loggedIn userId
            toUserId: loggedInUser._id,
            status: "interested"
        // }).populate("fromUserId", ["firstName","lastName"])
        }).populate(
            "fromUserId",
            "firstName lastName photoUrl age gender about skills"
        )
         
        res.json({
            message:  "data fetched successfully",
            data: connectionRequests,
        })
    }
    catch (err) {
        req.statusCode(400).send("ERROR :", err.message)
    }
})

userRouter.get("/user/connections", userAuth, async(req,res)=>{
try{
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
        $or:[
            {toUserId: loggedInUser._id, status : "accepted" },
            {fromUserId:loggedInUser._id, status: "accepted"}
        ],
    })
    .populate("fromUserId", USER_SAFE_DATA)
    .populate("toUserId", USER_SAFE_DATA);
     
console.log(connectionRequests)

    const data = connectionRequests.map(row=>{
        if(row.fromUserId._id.toString()=== loggedInUser._id.toString()){
            return row.toUserId;
        }
          return  row.fromUserId
        })
  res.json({data});
}catch(err){
    res.status(400).send({message: err.message})
}
})

userRouter.get("/feed", userAuth, async(req,res)=>{
  
    try{
        //user should see all the user expcet
        //0 his own card
        // 1 his connectrion
        // 2 ignored people 
        // 3 already people
        // 4 already send the connection request

        // example : kamran = [mark, donald, dhoni , virat]
        // if in this array anybody is inmy connection list
        // so in the feed i can not see their cards

        // if dhoni is in my connection list 
        // then  kamran = [mark donald, virat]

        const loggedInUser = req.user
         const page = parseInt(req.query.page) || 1;
         let limit = parseInt(req.query.limit) || 10
         limit=limit > 50 ? 50 : limit
         const skip = (page-1)*limit

        //i will find all the connection request (sent+received)
        const connectionRequests = await ConnectionRequest.find({
            $or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}],
        }).select("fromUserId toUserId")


        // it is part of dsa what it do if you store in and [a,b,c] first it will store
        // if any repaeted things come it will directly ignore it 
        // it is always contains unique elements
        const hideUserFromfeed = new Set();
        connectionRequests.forEach(req=>{
            hideUserFromfeed.add(req.fromUserId.toString())
            hideUserFromfeed.add(req.toUserId.toString())
        })
        console.log(hideUserFromfeed)
        
        const users = await User.find({
            $and:[
                {_id:{$nin: Array.from(hideUserFromfeed)}},
                {_id:{$ne:loggedInUser._id}},
            ],
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)
        
        res.send(users)
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
})

module.exports = userRouter