import mongoose from "mongoose";
const { Schema } = mongoose;

// Message Schema
const MessageSchema = new Schema(
  {
    ConversationId: {
        type: String,
        required: true,
    },
    UserId: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Message", MessageSchema);
