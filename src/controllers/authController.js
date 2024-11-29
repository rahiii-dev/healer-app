import OTP from "../models/OtpModal.js";
import { UserProfile } from "../models/ProfileModal.js";
import User, { PROFILE_MODALS, PROFILE_ROLES } from "../models/UserModal.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import { generateToken } from "../utils/jwt.js";
import { sendOtpEmail } from "../utils/sendOTP.js";

/**
 * @route   POST /api/auth/login
 * @desc    Login a user by verifying credentials (email and password)
 * @access  Public
 */
export const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  if (user.role === PROFILE_ROLES.user && !user.isVerified) {
    try {
      await sendOtpEmail(user.email);
      return res.json({
        message: "User not veified. Otp send",
        token: null,
        userId: user._id,
        role: user.role,
        isVerified: user.isVerified,
      });
    } catch (error) {
      return res.json({
        message: "User not veified. Failed to send otp",
        token: null,
        userId: user._id,
        role: user.role,
        isVerified: user.isVerified,
      });
    }
  }

  const token = generateToken({
    userId: user._id,
    role: user.role,
    isVerified: user.isVerified,
  });

  return res.json({
    token,
    userId: user._id,
    role: user.role,
    isVerified: user.isVerified,
  });
});

/**
 * @route   POST /api/auth/register
 * @desc    Register for normal user
 * @access  Public
 */
export const register = asyncWrapper(async (req, res) => {
  const { email, password, name } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email is already in use" });
  }

  const userProfile = await UserProfile.create({ name });

  const user = await User.create({
    email,
    password,
    role: PROFILE_ROLES.user,
    profileId: userProfile._id,
    profileModel: PROFILE_MODALS.user,
    isVerified: false,
  });

  try {
    await sendOtpEmail(user.email);
    return res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: userProfile,
        isVerified: user.isVerified,
        image: user.image,
      },
      message: "User registered. OTP send succesfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "User registered. Failed to send OTP.",
    });
  }
});

/**
 * @route   POST /api/auth/resend-otp
 * @desc    Resend otp to email
 * @access  Public
 */
export const resendOTP = asyncWrapper(async (req, res) => {
  const { email } = req.body;
  const userExist = await User.findOne({ email });

  if (!userExist) {
    return res.status(404).json({
      message: "User not found.",
    });
  }

  try {
    await sendOtpEmail(userExist.email);
    return res.status(200).json({
      message: "New otp send to your mail.",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to resend OTP.",
    });
  }
});

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify otp send by user
 * @access  Public
 */
export const verifyOTP = asyncWrapper(async (req, res) => {
  const { email, otp } = req.body;
  const otpExist = await OTP.findOne({ email });
  const userExist = await User.findOne({ email }).select("-password");

  if (!otpExist || !userExist || !(await otpExist.verifyOtp(otp))) {
    return res.status(400).json({
      message: "Invalid or expired otp",
    });
  }

  userExist.isVerified = true;
  await userExist.save();

  const token = generateToken({
    userId: userExist._id,
    role: userExist.role,
    isVerified: userExist.isVerified,
  });

  return res.json({
    token,
    userId: userExist._id,
    role: userExist.role,
    isVerified: userExist.isVerified,
  });
});
