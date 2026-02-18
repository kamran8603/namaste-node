const express = require("express")
const requestRouter = express.Router()
const {userAuth} = require("../middleware/auth")
const ConnectionRequest= require("../models/connectionRequest")
const User = require("../models/user")

requestRouter.post("/request/send/:status/:toUserId", userAuth, 
async(req, res)=>{
   try{
    const fromUserId = req.user._id
    const toUserId = req.params.toUserId
    const status = req.params.status

    const allowedStatus = ["ignored", "interested"]
    if(!allowedStatus.includes(status)){
        return res
        .status(400)
        .json({message: "invalid status type: "+status})
    }

    
//  user ko serach kre if user present hoga db me then request send krega
  const toUser = await User.findById(toUserId)
  if(!toUser){
    return res.status(404)
    .json({
        message:"User not found", 
    })
  }

  //check krnnge is an existing connection request
  const existingConnectionRequest = await ConnectionRequest.findOne({
   $or: [
    {fromUserId,toUserId},
    {fromUserId:toUserId,toUserId:fromUserId}
   ],
  });
  if(existingConnectionRequest){
    return res
    .status(400)
    .send({
        message: "Connection Request Already Exists"
    })
  }

    const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId, 
        status
    })
      const data = await  connectionRequest.save()
      res.json({
        message:req.user.firstName+ " is "+ status+" in " + toUser.firstName+ 
        data
    })
   }
   catch(err){
    
    res.status(400).send("ERROR :" + err.message )
   }
 

})

// this api is used to accept the request and decline the request
requestRouter.post("/request/review/:status/:requestId",userAuth, async(req,res)=>{
try{
const loggedInUser = req.user 
const {status, requestId }=req.params

const allowedStatus =["accepted", "rejected"]
if (!allowedStatus.includes(status)){
 return res.status(400).json({message: "Status not allowed!"})
}

//corner case if that request is present in my database or not 
const connectionRequest = await ConnectionRequest.findOne({
  _id:requestId,
  toUserId:loggedInUser._id,
  status:"interested"
})

// if i dont find the connection request
if(!connectionRequest){
  return res.status(404).json({message:"Connection request not found"})
}


//if i find  connection request where requestId is matching 
// status is intrested and to userid is same as the logginuser
// then i saved to chage the status
// status is coming from param
connectionRequest.status = status
const data = await connectionRequest.save() 

res.json({message:"Connection Request"+ status, data})


//akshay =>elon
//loggedInuser == toUesrId
//status = intrested
 
}
catch(err){
  res.status(400).send("ERROR : " + err.message);
}
}
)

module.exports=requestRouter; 


// important things to remember
// toUserId == login user

// hum jisko request bhej rhe hai touserId hua 
// and jisko req bhjnge usko liye object id jayega jo request me sbse top pr hoga
// and status change hokr accepted ho jayega when elon is login