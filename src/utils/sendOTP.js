import crypto from "node:crypto";
import OTP from "../models/OtpModal.js";
import mailTransporter from "./mailTransporter.js";

const generateOtp = async () => {
  return crypto.randomInt(100000, 999999);
};

export const sendOtpEmail = async (email) => {
  try {
    const otp = (await generateOtp()).toString()
    // console.log(email);
    // console.log(otp);

    const otpExist = await OTP.findOne({ email });
    if (otpExist) {
      otpExist.otp = otp;
      otpExist.createdAt = Date.now();
      await otpExist.save();
    } else {
      const newOtp = new OTP({ email, otp });
      await newOtp.save();
    }

    const mailOptions = {
      from: process.env.MAIL_ID,
      to: email,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center;">
          <h1>Your OTP Code</h1>
          <p>Your OTP code is <strong>${otp}</strong></p>
        </div>
      `,
    };

    await mailTransporter.sendMail(mailOptions);

    return "OTP sent successfully";
  } catch (error) {
    // console.log(error);
    throw new Error("Failed to send OTP");
  }
};
