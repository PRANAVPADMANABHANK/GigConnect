import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./src/adapters/routes/user.route.js";
import gigRoute from "./src/adapters/routes/gig.route.js";
import orderRoute from "./src/adapters/routes/order.route.js";
import conversationRoute from "./src/adapters/routes/conversation.route.js";
import messageRoute from "./src/adapters/routes/message.route.js";
import reviewRoute from "./src/adapters/routes/review.route.js";
import authRoute from "./src/adapters/routes/auth.route.js";
import walletRoute from "./src/adapters/routes/wallet.route.js";
import adminRoute from "./src/adapters/routes/admin.route.js"
import chatRoute from "./src/adapters/routes/chat.route.js"
import messagesRoutes from "./src/adapters/routes/messages.route.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import http from 'http';
import { Server as SocketServer } from 'socket.io';

const app = express();

//configure the .env
dotenv.config();

//database connection
mongoose.set("strictQuery", true);
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB!");
  } catch (error) {
    console.log(error);
  }
};

//middleware
app.use(cors({ origin: "http://gigconnect.stepups.live", credentials: true })); //"origin" => represents we are connecting frontend to backend using cors library. "credential" => represents passing cookie from frontend to backend.
app.use(express.json()); //this will allow to pass any json from the client side
app.use(cookieParser()); //to use cookies in the client side

// endpoints
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute); // "/api/user" is the end point and to make a request using this end point we are using userRoute
app.use("/api/gigs", gigRoute);
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute); 
app.use("/api/reviews", reviewRoute);
app.use("/api/wallets", walletRoute);
app.use("/api/chat", chatRoute)
app.use("/api/admin", adminRoute)
app.use("/api/message", messagesRoutes);

//error handling middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";

  return res.status(errorStatus).send(errorMessage);
});

//port connection
// app.listen(process.env.PORT, () => {
//   connect();
//   console.log("Backend server is running!");
// });

const httpServer = http.createServer(app);
const server = httpServer.listen(process.env.PORT, () => {
  connect();
  console.log('Backend server is running!');
});

const io = new SocketServer(httpServer, {
  pingTimeout:60000,
  cors: {
    origin: 'http://localhost:5173',
  },
});

io.on("connection", (socket)=>{
  console.log('connected to socket.io')

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  })

  socket.on('join chat', (room)=>{
    socket.join(room)
    console.log("User Joined Room: " + room)   
  })

  socket.on('typing',(room)=>socket.in(room).emit("typing"))
  socket.on('stop typing',(room)=>socket.in(room).emit("stop typing"))

  socket.on("new message", (newMessageRecieved) => {
    // console.log(newMessageRecieved.data.chat.users, "newMessageRecieved")
    console.log(newMessageRecieved, "sender")
    var chat = newMessageRecieved.data.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.data.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
})