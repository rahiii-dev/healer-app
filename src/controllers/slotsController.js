import AppointmentModal, { APPOINTMENT_STATUS } from "../models/AppointmentModal.js";
import Slots from "../models/SlotsModal.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import moment from 'moment';

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
  
  const startOfDay = moment(date).startOf('day').toDate();
  const endOfDay = moment(date).endOf('day').toDate();

  const activeSlots = await Slots.findOne({
    therapist: therapistId,
    day: moment(date).format('dddd'),
    isActive: true,
  });

  if(!activeSlots){
    return res.json({availableSlots: []})
  }

  const bookedSlots = await AppointmentModal.find({
    therapist: therapistId,
    startTime: { $gte: startOfDay, $lte: endOfDay },
    status: { $ne: APPOINTMENT_STATUS.cancelled } 
  }).distinct("slot");

  if(bookedSlots.length === 0){
    return res.json({availableSlots: activeSlots.timeSlots})
  }

  const availableSlots = activeSlots.map(slot => {
    const availableTimeSlots = slot.timeSlots.filter(timeSlot => {
      return !bookedSlots.includes(timeSlot._id.toString());
    });

    return {
      ...slot.toObject(),
      timeSlots: availableTimeSlots,
    };
  });

  console.log({availableSlots});

  return res.status(200).json({ availableSlots });
});
