import mongoose from 'mongoose';

export const SLOT_DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]

const TherapistSlotSchema = new mongoose.Schema(
  {
    therapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    day: {
      type: String,
      enum: SLOT_DAYS,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    timeSlots: [
      {
        startTime: {
          type: String, 
          required: true,
        },
        endTime: {
          type: String, 
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("TherapistSlot", TherapistSlotSchema);
