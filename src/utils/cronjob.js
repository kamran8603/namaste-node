const cron = require("node-cron")
const { subDays, startOfDay, endOfDay } = require("date-fns")
const sendEmail = require("./sendEmail");
const ConnectionRequestModel = require("../models/connectionRequest")

console.log("cron started")
cron.schedule("50 11 * * *", async () => {
    //sends email to all people who got requests the previous day
    try {
        const yesterday = subDays(new Date(), 0)
        const yesterdayStart = startOfDay(yesterday)
        const yesterdayEnd = endOfDay(yesterday)

        const pendingRequests = await ConnectionRequestModel.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd,
            },
        }).populate("fromUserId toUserId")
        

        const listOfEmails = [...new Set(pendingRequests.map((req)=>req.toUserId.emailId))]
        console.log(listOfEmails)

        for (const email of listOfEmails) {
            //send emails
            try {
                const res = await sendEmail.run(
                    "New Friend Request pending for  "+ email,  
                    "There are so many request pending please login to the CodeSpark  and accept reject the request "
                );
                    console.log(res)
            }
            catch (err){
                console.log(err)
            }

        }
    }
    catch {
        console.error(err)
    }
})