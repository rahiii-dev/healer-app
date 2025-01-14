import { USER_GENDERS, UserProfile } from "../models/ProfileModal.js";
import User, { PROFILE_MODALS } from "../models/UserModal.js";
import asyncWrapper from "../utils/asyncWrapper.js";

/**
 * @route   GET /api/user/profile
 * @desc    get profile of an authenticated user
 * @access  Private
 */
export const getProfile = asyncWrapper(async (req, res) => {
  const id = req.user?.userId;

  const user = await User.findById(id)
    .populate({
      path: "profile",
    })
    .select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ user });
});

/**
 * @route   PUT /api/user/profile
 * @desc    update client profile
 * @access  Private
 */
export const updateClientProfile = asyncWrapper(async (req, res) => {
  const id = req.user?.userId;
  const { name, gender } = req.body;

  if (gender && !Object.values(USER_GENDERS).includes(gender)) {
    return res.status(400).json({
      message: `Invalid gender type ${Object.values(
        USER_GENDERS
      )} are allowed.`,
    });
  }

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const userProfile = await UserProfile.findById(user.profile);

  if (!userProfile) {
    return res.status(404).json({ message: "User profile not found" });
  }

  if (gender) {
    userProfile.gender = gender;
  }

  if (name) {
    userProfile.name = name;
  }

  if (req.imageUrl) {
    user.image = req.imageUrl;
  }

  await userProfile.save();
  await user.save();

  res.status(200).json({
    message: "User updated successfully",
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      profile: userProfile,
      isVerified: user.isVerified,
      image: user.image,
    },
  });
});
