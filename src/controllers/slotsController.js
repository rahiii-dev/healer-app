import AppointmentModal, {
  APPOINTMENT_STATUS,
} from "../models/AppointmentModal.js";
import Slots from "../models/SlotsModal.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import moment from "moment";

/**
 * @route   POST /api/slots
 * @desc    Add for therapist
 * @access  Private for Therapist only
 */
export const createSlots = asyncWrapper(async (req, res) => {
  const therapistId = req.user.userId;
  const { slots } = req.body;

  for (const slot of slots) {
    await Slots.updateOne(
      { therapist: therapistId, day: slot.day },
      {
        $set: {
          isActive: slot.isActive,
          timeSlots: slot.timeSlots,
        },
      },
      { upsert: true }
    );
  }

  return res
    .status(200)
    .json({ message: "Slots have been updated successfully." });
});
/**
 * @route   GET /api/slots
 * @desc    Get therapist slots
 * @access  Private for Therapist only
 */
export const getSlots = asyncWrapper(async (req, res) => {
  const therapistId = req.user.userId;
  const slots = await Slots.find({ therapist: therapistId });
  return res.json(slots);
});

/**
 * @route   GET /api/slots/:therapistId/:date
 * @desc    List active slots available for a therapist on a particular date
 * @access  Private for Client only
 */
export const getAvailableSlotsForDate = asyncWrapper(async (req, res) => {
  const { therapistId, date } = req.params;

  if (!moment(date, "YYYY-MM-DD", true).isValid()) {
    return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD." });
  }

  const isToday = moment().isSame(date, "day"); 
  const currentTime = moment(); 

  const activeSlots = await Slots.findOne({
    therapist: therapistId,
    day: moment(date).format("dddd"), 
    isActive: true,
  }).select("timeSlots");

  if (!activeSlots || !activeSlots.timeSlots.length) {
    return res.json({ availableSlots: [] });
  }

  const bookedSlots = await AppointmentModal.find({
    therapist: therapistId,
    date,
    status: { $ne: APPOINTMENT_STATUS.cancelled }, 
  }).select("startTime endTime");

  // Function to check if a slot is booked
  const isSlotBooked = (slot) => {
    return bookedSlots.some((booked) => {
      const slotStart = moment(slot.startTime, "hh:mm a");
      const slotEnd = moment(slot.endTime, "hh:mm a");
      const bookedStart = moment(booked.startTime, "hh:mm a");
      const bookedEnd = moment(booked.endTime, "hh:mm a");

      return (
        (bookedStart.isBetween(slotStart, slotEnd, null, "[)")) ||
        (bookedEnd.isBetween(slotStart, slotEnd, null, "(]")) ||
        (slotStart.isBetween(bookedStart, bookedEnd, null, "[)") && slotEnd.isBetween(bookedStart, bookedEnd, null, "(]"))
      );
    });
  };

  // Filter available slots
  const availableSlots = activeSlots.timeSlots.filter((slot) => {
    const slotStart = moment(slot.startTime, "hh:mm a");

    if (isToday && slotStart.isBefore(currentTime)) {
      return false;
    }

    return !isSlotBooked(slot);
  });

  return res.status(200).json({ availableSlots });
});

