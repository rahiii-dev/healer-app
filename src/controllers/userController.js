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

  return res.json({user})
});
