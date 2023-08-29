import mongoose from "mongoose";
const { Schema } = mongoose;

const WalletSchema = new Schema(
  {
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Wallet", WalletSchema);
