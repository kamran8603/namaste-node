const socket = require("socket.io")
const crypto = require("crypto");
const { Chat } = require("../models/chat");
// to protect the chat
const getSecureRoomId = (userId, targetUserId) => {
    return crypto
        .createHash('sha256')
        .update([userId, targetUserId].sort().join("$"))
        .digest("hex")
};
const initializeSocket = (Server) => {

    const io = socket(Server, {
        cors: {
            origin: "http://localhost:5173"
        }
    })

    io.on("connection", (socket) => {

        //handle  events
        socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
            const roomId = getSecureRoomId(userId, targetUserId)
            console.log(firstName + " Joined Room : " + roomId)
            socket.join(roomId)

        })
        //these are the events for socket.io
        socket.on("sendMessage", async ({ firstName, lastName, userId, targetUserId, text }) => {

            // this is how you can create the room id

            // yh message ko receive krke room id pr bhjta hai


            //here we need to store the message in the database
            try {
                const roomId = getSecureRoomId(userId, targetUserId)
                console.log(firstName + " " + text)

                let chat = await Chat.findOne({
                    //  $all means all the people in this array should be participants
                    participants: { $all: [userId, targetUserId] }
                })
                if (!chat) {
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: [],
                    })
                }
                chat.messages.push({
                    senderId: userId,
                    text
                })
                await chat.save()
                io.to(roomId).emit("messageReceived", { firstName, lastName, text })


            } catch (err) {
                console.log(err.message)

            }



        })
        socket.on("disconnect", () => {

        })
    })

}
module.exports = initializeSocket