import Request, { REQUEST_STATUS } from "../models/RequestModel.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import { isValidObjectId } from "mongoose";


/**
 * @route   POST /api/requests
 * @desc    Client sends request to therapist
 * @access  Private for User only
 */
export const sendRequest = asyncWrapper(async (req, res) => {
  const { clientId, therapistId } = req.body;

  if (!clientId || !therapistId) {
    return res.status(422).json({ message: "Client ID and Therapist ID are required." });
  }

  if (!isValidObjectId(clientId) || !isValidObjectId(therapistId)) {
    return res.status(422).json({ message: "Invalid Client ID or Therapist ID." });
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
 * @route   GET /api/requests/therapist/:therapistId
 * @desc    Therapist fetch their requests
 * @access  Private for Therapist only
 */
export const getRequestsForTherapist = asyncWrapper(async (req, res) => {
  const { therapistId } = req.params;
  const { status } = req.query;

  if (!isValidObjectId(therapistId)) {
    return res.status(422).json({ message: "Invalid Therapist ID." });
  }

  if (status && !Object.values(REQUEST_STATUS).includes(status)) {
    return res.status(422).json({ message: "Invalid status filter." });
  }

  const query = { therapist: therapistId };
  if (status) query.status = status;

  const requests = await Request.find(query).populate({
    path: "client",
    populate: {
      path: "profile",
    },
  });

  return res.status(200).json({ requests });
});

/**
 * @route   GET /api/requests/client/:clientId
 * @desc    Client fetch their requests
 * @access  Private for Client only
 */
export const getRequestsForClient = asyncWrapper(async (req, res) => {
  const { clientId } = req.params;

  if (!isValidObjectId(clientId)) {
    return res.status(422).json({ message: "Invalid Client ID." });
  }

  const requests = await Request.find({ client: clientId }).populate({
    path: "therapist",
    populate: {
      path: "profile",
    },
  });

  return res.status(200).json({ requests });
});
