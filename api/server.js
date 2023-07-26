import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./src/adapters/routes/user.route.js"

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

app.use("/api/users",userRoute); // "/api/user" is the end point and to make a request using this end point we are using userRoute

//port connection
app.listen(8800, () => {
  connect();
  console.log("Backend server is running!");
});
