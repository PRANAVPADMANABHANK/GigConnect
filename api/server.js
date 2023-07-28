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
import cookieParser from "cookie-parser";

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

//error handling middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";

  return res.status(errorStatus).send(errorMessage);
});

//port connection
app.listen(8800, () => {
  connect();
  console.log("Backend server is running!");
});
