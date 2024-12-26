import mongoose from 'mongoose';

export const APPOINTMENT_STATUS = Object.freeze({
    'pending': "pending",
    'accepted': "accepted",
    'confirmed': "confirmed",
    'completed': "completed",
    'cancelled': "cancelled",
});

const AppointmentSchema = new mongoose.Schema(
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
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TherapistSlot",
      required: true,
    },
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
    status: {
      type: String,
      enum: Object.values(APPOINTMENT_STATUS),
      default: APPOINTMENT_STATUS.pending,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", AppointmentSchema);
