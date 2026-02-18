const mongoose = require("mongoose")

 const connectionRequestSchema= new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User" ,//refrence to the user collection
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{ 
        type:String,
        required:true,
        enum:{
            values:["ignored", "interested", "accepted","rejected"],
            message:`{VALUES} is oncorrect status type `
        }
    }

 },
 {timestamps:true}
 );

//  this is how we put the indexing so it make our query faster 
connectionRequestSchema.index({fromUserId:1, toUserId:1})


// Node.js + Mongoose me pre("save") middleware (hook) ka
// use hota hai data database me save hone se pehle kuch 
// validation ya logic chalane ke liye.

 connectionRequestSchema.pre("save", function (){
   const connectionRequest=this 
    //check if the fromUserId is same to userId

    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
     throw new Error("you cannot send connection request to yourself")
    }
   console.log("next is working")
 })



 const ConnectionRequestModel= new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
    )
    
 module.exports= ConnectionRequestModel;  