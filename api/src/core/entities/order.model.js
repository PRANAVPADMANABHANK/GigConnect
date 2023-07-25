import mongoose from "mongoose";
const { Schema } = mongoose;

// order Schema
const OrderSchema = new Schema(
  {
    
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", OrderSchema);
