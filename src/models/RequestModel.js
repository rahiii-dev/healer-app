import mongoose from "mongoose";

export const REQUEST_STATUS = Object.freeze({
  pending: "Pending",
  accepted: "Accepted",
  declined: "Declined",
});

const RequestSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    therapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(REQUEST_STATUS),
      default: REQUEST_STATUS.pending,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Request", RequestSchema);
