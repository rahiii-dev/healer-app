import moment from "moment";
import Slots from "../models/SlotsModal";
import asyncWrapper from "../utils/asyncWrapper";

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
  return await Slots.find({ therapist: therapistId });
});

