import mongoose from "mongoose";

export const MESSAGE_STATUS = Object.freeze({
    'SEND': "send",
    'DELIVERED': "delivered",
    'READ': "read",
});

const messageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  status: {
    type: String,
    enum: Object.values(MESSAGE_STATUS),
    default: MESSAGE_STATUS.SEND,
  },
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
}, { timestamps: true});

export default mongoose.model("Message", messageSchema);
