import Request, { REQUEST_STATUS } from "../models/RequestModel.js";
import User, { PROFILE_ROLES } from "../models/UserModal.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import { isValidObjectId } from "mongoose";

/**
 * @route   GET /api/user/therapists
 * @desc    List therapists available for the user to send requests
 * @access  Private for User only
 */
export const listTherapistsForUser = asyncWrapper(async (req, res) => {
    const { userId } = req.user; 
  
    const requestedTherapists = await Request.find({ client: userId, status: { $ne: REQUEST_STATUS.declined } }).distinct("therapist");
  
    const availableTherapists = await User.find({ 
      _id: { $nin: requestedTherapists }, role: PROFILE_ROLES.therapist 
    }).populate('profile').select('-password');
  
    return res.status(200).json({ therapists: availableTherapists });
});

/**
 * @route   POST /api/requests
 * @desc    Client sends request to therapist
 * @access  Private for User only
 */
export const sendRequest = asyncWrapper(async (req, res) => {
  const { therapistId } = req.body;
  const clientId = req.user.userId;

  if (!clientId || !therapistId) {
    return res.status(422).json({ message: "Client ID and Therapist ID are required." });
  }

  if (!isValidObjectId(clientId) || !isValidObjectId(therapistId)) {
    return res.status(422).json({ message: "Invalid Client ID or Therapist ID." });
  }

  const existingRequest = await Request.findOne({
    client: clientId,
    therapist: therapistId,
  });

  if (existingRequest) {
    if (existingRequest.status === REQUEST_STATUS.declined) {
      existingRequest.status = REQUEST_STATUS.pending; 
      await existingRequest.save();
      return res.status(200).json({
        message: "Request sent successfully, the therapist was previously declined.",
        request: existingRequest,
      });
    } else {
      return res.status(422).json({ message: "You have already sent a request to this therapist." });
    }
  }

  const therapist = await User.findOne({_id: therapistId, role: PROFILE_ROLES.therapist});
  console.log({therapist});
  
  if(!therapist) {
    return res.status(400).json({ message: "Therapist not found" });
  }

  const newRequest = await Request.create({
    client: clientId,
    therapist: therapistId,
  });

  return res
    .status(201)
    .json({ message: "Request sent successfully.", request: newRequest });
});

/**
 * @route   POST /api/requests/respond
 * @desc    Therapist respond to request
 * @access  Private for Therapist only
 */
export const respondToRequest = asyncWrapper(async (req, res) => {
  const { requestId, status } = req.body;

  if (!isValidObjectId(requestId)) {
    return res.status(422).json({ message: "Invalid Request ID." });
  }

  if (![REQUEST_STATUS.accepted, REQUEST_STATUS.declined].includes(status)) {
    return res.status(422).json({ message: "Invalid status." });
  }

  const updatedRequest = await Request.findByIdAndUpdate(
    requestId,
    { status },
    { new: true }
  );

  if (!updatedRequest) {
    return res.status(404).json({ message: "Request not found." });
  }

  return res
    .status(200)
    .json({ message: `Request ${status} successfully.`, request: updatedRequest });
});

/**
 * @route   GET /api/requests/therapist
 * @desc    Therapist fetch their requests
 * @access  Private for Therapist only
 */
export const getRequestsForTherapist = asyncWrapper(async (req, res) => {
  const  therapistId = req.user.userId;
  const { status } = req.query;

  if (!isValidObjectId(therapistId)) {
    return res.status(422).json({ message: "Invalid Therapist ID." });
  }

  if (!Object.values(REQUEST_STATUS).includes(status)) {
    return res.status(422).json({ message: "Invalid status filter." });
  }

  const query = { therapist: therapistId };
  if (status) query.status = status;

  const requests = await Request.find(query).populate({
    path: "client",
    populate: {
      path: "profile",
    },
    select: "-password"
  });

  return res.status(200).json({ requests });
});

/**
 * @route   GET /api/requests/client
 * @desc    Client fetch their requests
 * @access  Private for Client only
 */
export const getRequestsForClient = asyncWrapper(async (req, res) => {
  const clientId = req.user.userId;
  const { status } = req.query;

  if (!isValidObjectId(clientId)) {
    return res.status(422).json({ message: "Invalid Client ID." });
  }

  if (!Object.values(REQUEST_STATUS).includes(status)) {
    return res.status(422).json({ message: "Invalid status filter." });
  }

  const query = { client: clientId };
  if (status) query.status = status;

  const requests = await Request.find(query).populate({
    path: "therapist",
    populate: {
      path: "profile",
    },
    select: "-password"
  });

  return res.status(200).json({ requests });
});
