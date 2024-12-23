import { body } from "express-validator";
import moment from "moment";
import { SLOT_DAYS } from "../models/SlotsModal.js";

export const validateCreateSlots = [
  body("slots")
    .isArray({ min: 1 })
    .withMessage("Slots must be a non-empty array."),

  body("slots.*.day")
    .isString()
    .withMessage("Day must be a string.")
    .isIn(SLOT_DAYS)
    .withMessage("Day must be a valid weekday."),

  body("slots.*.isActive")
    .isBoolean()
    .withMessage("isActive must be a boolean."),

  body("slots.*.timeSlots")
    .isArray({ min: 1 })
    .withMessage("Time slots must be a non-empty array."),

  body("slots.*.timeSlots.*.startTime")
    .matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("startTime must be in HH:mm format (24-hour) or hh:mm a format (12-hour with AM/PM)."),

  body("slots.*.timeSlots.*.endTime")
    .matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("endTime must be in HH:mm format (24-hour) or hh:mm a format (12-hour with AM/PM)."),

  body("slots.*.timeSlots.*").custom((value, { req }) => {
    const { startTime, endTime } = value;
    const start = moment(startTime, ["HH:mm", "hh:mm a"], true);
    const end = moment(endTime, ["HH:mm", "hh:mm a"], true);

    if (!start.isValid() || !end.isValid()) {
      throw new Error("Invalid time format. Use HH:mm (24-hour) or hh:mm a (12-hour with AM/PM).");
    }

    if (start.isSameOrAfter(end)) {
      throw new Error("startTime must be less than endTime.");
    }

    return true;
  }),

  body("slots.*.timeSlots.*.amount")
    .isNumeric()
    .withMessage("Amount must be a number."),
];
