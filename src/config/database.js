const mongoose  = require("mongoose")
const url = "mongodb+srv://kamranhaider_db_user:JML40HKcO183cGSE@cluster0.bzahq2u.mongodb.net/devTinder"

const connectDb = async ()=>{
    await mongoose.connect(url)
} 
module.exports = connectDb