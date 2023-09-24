const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const userRoutes = require('./routes/userRoute')
const messagesRoutes = require('./routes/messagesRoute')
const socket = require('socket.io')


const app = express();
require("dotenv").config();

app.use(cors())
app.use(express.json());

app.use("/api/auth",userRoutes)
app.use("/api/message",messagesRoutes)

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>{
    console.log("db connection successfull");
})
.catch((err) =>{
    console.log(err.message)
})


const server = app.listen(process.env.PORT,()=>{
    console.log(`Serer start on Port ${process.env.PORT}`)
})
const io = socket(server,{
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    }
})

global.onlineUsers = new Map()
io.on("connection",(socket)=>{
    global.chatSocket = socket;
    socket.on("add-user", (userId)=>{
        onlineUsers.set(userId, socket.id)
        console.log(userId, socket.id)
    })
    socket.on("send-msg", (data)=>{
        const sendUserSocket = onlineUsers.get(data.to);
        console.log(sendUserSocket)
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve", data.message)
        }
    })
})

