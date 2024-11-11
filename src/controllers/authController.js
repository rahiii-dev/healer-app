import { UserProfile } from "../models/ProfileModal.js";
import User, { PROFILE_MODALS, PROFILE_ROLES } from "../models/UserModal.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import { generateToken } from "../utils/jwt.js";

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

  const token = generateToken({ userId: user._id, role: user.role });

  return res.json({ token, userId: user._id, role: user.role });
});

/**
 * @route   POST /api/auth/register
 * @desc    Register for normal user
 * @access  Public
 */
export const register = asyncWrapper(async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "Email, password, and name are required" });
  }

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

  res.status(201).json({
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      profileId: user.profileId,
      isVerified: user.isVerified,
      image: user.image
    },
    message: "User registered successfully"
  });
});
