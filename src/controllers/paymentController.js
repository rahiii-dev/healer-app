import { razorpay } from "../config/razorpay.js";
import AppointmentModal, { APPOINTMENT_STATUS } from "../models/AppointmentModal.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import crypto from 'node:crypto';

/**
 * @route   POST /api/payment/initiate
 * @desc    initiate a payment
 * @access  Public
 */
export const initiatePayment = asyncWrapper(async (req, res) => {
  const { appointmentId, amount } = req.body;

  const appointment = await AppointmentModal.findById(appointmentId);
  if(!appointment || appointment.status != APPOINTMENT_STATUS.accepted){
    return res.status(400).json({ message: "Invalid appointment id" });
  }

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${appointmentId}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    appointment.paymentOrderId = order.id;
    await appointment.save();

    return res.json({
      orderId: order.id,
      amount: order.amount,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Payment initiation failed", error: err });
  }
});

/**
 * @route   POST /api/payment/verify
 * @desc    verify a payment
 * @access  Private
 */
export const verifyPayment = asyncWrapper(async (req, res) => {
  const { paymentId, orderId, signature } = req.body;

  const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  shasum.update(orderId + "|" + paymentId);
  const generatedSignature = shasum.digest("hex");

  if (generatedSignature !== signature) {
    return res.status(400).json({ message: "Payment verification failed" });
  }

  const appointment = await AppointmentModal.findOne({
    paymentOrderId: orderId,
  });

  if(!appointment){
    return res.status(400).json({ message: "Invalid orderId" });
  }

  appointment.status = APPOINTMENT_STATUS.confirmed;
  appointment.paymentId = paymentId;
  await appointment.save();

  return res.status(200).json({ message: "Payment verified successfully" });
});
