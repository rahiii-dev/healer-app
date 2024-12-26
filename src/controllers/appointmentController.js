import { isValidObjectId } from "mongoose";
import AppointmentModal, {
  APPOINTMENT_STATUS,
} from "../models/AppointmentModal.js";
import SlotsModal from "../models/SlotsModal.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import moment from "moment";

/**
 * @route   GET /api/appointment/therapist?status=pending
 * @desc    get appointments
 * @access  Private for therapist only
 */
export const getTherapistAppointment = asyncWrapper(async (req, res) => {
  const therapist = req.user.userId;
  const { status } = req.query;

  let filterQuery = { therapist };
  if (status && Object.values(APPOINTMENT_STATUS).includes(status)) {
    filterQuery.status = status;
  }

  const appointments = await AppointmentModal.find(filterQuery).populate({
    path: "client",
    populate: {
      path: "profile",
    },
    select: "profile profileModel image email",
  });

  return res.json(appointments);
});
/**
 * @route   POST /api/appointment/client?status=pending
 * @desc    get appointments
 * @access  Private for client only
 */
export const getClientAppointment = asyncWrapper(async (req, res) => {
  const client = req.user.userId;
  const { status } = req.query;

  let filterQuery = { client };
  if (status && Object.values(APPOINTMENT_STATUS).includes(status)) {
    filterQuery.status = status;
  }

  const appointments = await AppointmentModal.find(filterQuery).populate({
    path: "therapist",
    populate: {
      path: "profile",
    },
    select: "profile profileModel image email",
  });

  return res.json(appointments);
});

/**
 * @route   POST /api/appointment/book/:therapistId
 * @desc    Book a slot for therapist
 * @access  Private for Client only
 */
export const bookAppointment = asyncWrapper(async (req, res) => {
  const { startTime, endTime, amount, date } = req.body;
  const client = req.user.userId;
  const { therapistId } = req.params;

  const therapistSlots = await SlotsModal.findOne({
    therapist: therapistId,
    day: moment(date).format("dddd"),
    isActive: true,
  });

  if (!therapistSlots) {
    return res
      .status(404)
      .json({ message: "Therapist not found or no slots available" });
  }

  const slot = therapistSlots.timeSlots.find(
    (slot) =>
      slot.startTime === startTime &&
      slot.endTime === endTime &&
      slot.amount === amount
  );

  if (!slot) {
    return res.status(404).json({ message: "Slot not available" });
  }

  const existingBooking = await AppointmentModal.findOne({
    therapist: therapistId,
    client,
    date,
    startTime,
    endTime,
    status: {
      $nin: [APPOINTMENT_STATUS.cancelled],
    },
  });

  if (existingBooking) {
    return res.status(400).json({ message: "Slot already booked" });
  }

  const newAppointment = new AppointmentModal({
    therapist: therapistId,
    client,
    startTime,
    endTime,
    amount,
    date,
  });

  await newAppointment.save();

  return res.status(201).json({
    message: "Slot booked successfully",
    appointment: newAppointment,
  });
});

/**
 * @route   PUT /api/appointment/respond
 * @desc    Accept Appointment
 * @access  Private for Therapis only
 */
export const respondToAppointment = asyncWrapper(async (req, res) => {
  const { appointmentId, status } = req.body;

  if (!isValidObjectId(appointmentId)) {
    return res.status(422).json({ message: "Invalid Request ID." });
  }

  if (![APPOINTMENT_STATUS.accepted, APPOINTMENT_STATUS.cancelled].includes(status)) {
    return res.status(422).json({ message: "Invalid status." });
  }

  const updatedAppointment = await AppointmentModal.findByIdAndUpdate(
    appointmentId,
    { status },
    { new: true }
  );

  if (!updatedAppointment) {
    return res.status(404).json({ message: "Appointment not found." });
  }

  return res
    .status(200)
    .json({
      message: `Appointment ${status} successfully.`,
      request: updatedAppointment,
    });
});
