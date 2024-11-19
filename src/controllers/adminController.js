import { TherapistProfile } from "../models/ProfileModal.js";
import User, {
  DEFAULT_USER_IMAGE,
  PROFILE_MODALS,
  PROFILE_ROLES,
} from "../models/UserModal.js";
import asyncWrapper from "../utils/asyncWrapper.js";

/**
 * @route   GET /api/admin/search?target=user&role=therapist&query=searchstring
 * @desc    Admin can search based on target and role
 * @access  Private (Admin)
 */
async function serchUser(role, query) {
  try {
    const { [PROFILE_MODALS[role]]: ProfileModel } = await import("../models/ProfileModal.js");

    const users = await User.find({
      role,
      $or: [
        { email: { $regex: query, $options: "i" } }, 
        {
          profile: {
            $in: await ProfileModel.find({
              name: { $regex: query, $options: "i" }, 
            }).distinct("_id"),
          },
        },
      ],
    })
      .populate({
        path: "profile",
        model: PROFILE_MODALS[role],
      })
      .select('-password -profileModel')
      .exec();

    const filteredUsers = users.filter((user) => user.profile !== null);

    return filteredUsers;

  } catch (error) {
    console.error("Error during search:", error);
    throw error;
  }
}

export const search = asyncWrapper(async (req, res) => {
  const { target, role, query } = req.query;
  const SEARCH_TARGETS = ['user']

  if (!target || !query) {
    return res.status(400).json({ message: "target, and query are required." });
  }

  if(target === 'user') {
    if(!role){
      return res.status(400).json({ message: "role is required if target is user" });
    }

    if (!Object.keys(PROFILE_MODALS).includes(role)) {
      return res.status(400).json({ message: `Invalid role. Valid roles are: ${Object.keys(PROFILE_MODALS).join(', ')}` });
    }

    const users = await serchUser(role, query);

    return res.json({
      users,
      count: users.length
    })

  } else {
    return res.status(400).json({ message: `Invalid serch target. Valid targets are: ${SEARCH_TARGETS}` });
  }
});

/**
 * @route   POST /api/admin/therapist
 * @desc    Create a new therapist profile. Only admins can create a therapist.
 * @access  Private (Admin)
 */
export const createTherapist = asyncWrapper(async (req, res) => {
  const {
    email,
    password,
    name,
    qualification,
    specialization,
    experience,
    bio,
  } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email is already in use" });
  }

  let imageURL = req.imageUrl || DEFAULT_USER_IMAGE;

  const user = new User({
    email,
    password,
    role: PROFILE_ROLES.therapist,
    profileModel: PROFILE_MODALS.therapist,
    image: imageURL,
  });

  await user.save();

  const therapistProfile = new TherapistProfile({
    user: user._id,
    name,
    qualification,
    specialization,
    experience,
    bio,
  });

  await therapistProfile.save();

  user.profile = therapistProfile._id;
  await user.save();

  res.status(201).json({
    message: "Therapist created successfully",
    therapist: {
      userId: user._id,
      email: user.email,
      name: therapistProfile.name,
      qualification: therapistProfile.qualification,
      specialization: therapistProfile.specialization,
      experience: therapistProfile.experience,
      bio: therapistProfile.bio,
      image: user.image,
    },
  });
});

/**
 * @route   PUT /api/admin/therapist/:profileId
 * @desc    Update Therapist details.
 * @access  Private (Admin)
 */
export const updateTherapist = asyncWrapper(async (req, res) => {
  const {
    email,
    password,
    name,
    qualification,
    specialization,
    experience,
    bio,
  } = req.body;

  const { profileId } = req.params;

  const therapistProfile = await TherapistProfile.findById(profileId);

  if (!therapistProfile) {
    return res.status(404).json({ message: "Therapist profile not found" });
  }

  const existingUser = await User.findOne({
    email,
    profile: { $ne: therapistProfile.id },
  });

  if (existingUser) {
    return res.status(400).json({ message: "Email is already in use" });
  }

  if (name) therapistProfile.name = name;
  if (qualification) therapistProfile.qualification = qualification;
  if (specialization) therapistProfile.specialization = specialization;
  if (experience) therapistProfile.experience = experience;
  if (bio) therapistProfile.bio = bio;

  await therapistProfile.save();

  const user = await User.findOne({ profile: { $eq: therapistProfile.id } });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (password) {
    user.password = password;
  }

  if (req.imageUrl) {
    user.image = req.imageUrl;
  }

  await user.save();

  res.status(200).json({
    message: "Therapist updated successfully",
    therapist: {
      userId: user._id,
      email: user.email,
      name: therapistProfile.name,
      qualification: therapistProfile.qualification,
      specialization: therapistProfile.specialization,
      experience: therapistProfile.experience,
      bio: therapistProfile.bio,
      image: user.image,
    },
  });
});

/**
 * @route   DELETE /api/admin/therapist/:profileId
 * @desc    Delete Therapist details.
 * @access  Private (Admin)
 */
export const deleteTherapist = asyncWrapper(async (req, res) => {
  const { profileId } = req.params;

  const therapistProfile = await TherapistProfile.findOneAndDelete({
    _id: profileId,
  });
  if (!therapistProfile) {
    return res.status(404).json({ message: "Therapist profile not found" });
  }

  const user = await User.findOneAndDelete({ profile: therapistProfile._id });
  if (!user) {
    return res.status(404).json({ message: "Associated user not found" });
  }

  res.status(200).json({ message: "Therapist deleted successfully" });
});

/**
 * @route   GET /api/admin/therapist/:profileId
 * @desc    Get Therapist details.
 * @access  Private (Admin)
 */
export const getTherapist = asyncWrapper(async (req, res) => {
  const { profileId } = req.params;

  const therapist = await User.findOne({
    profile: profileId,
    role: PROFILE_ROLES.therapist,
  })
    .populate({
      path: "profile",
      model: PROFILE_MODALS.therapist,
    })
    .select("-password -profileModel");

  if (!therapist) {
    return res.status(404).json({ message: "Therapist not found" });
  }

  return res.status(200).json({ therapist });
});

/**
 * @route   GET /api/admin/therapist/list
 * @desc    List all Therapist.
 * @access  Private (Admin)
 */
export const listTherapist = asyncWrapper(async (req, res) => {
  const therapists = await User.find({ role: PROFILE_ROLES.therapist })
    .populate({
      path: "profile",
      model: PROFILE_MODALS.therapist,
    })
    .select("-password -profileModel");

  return res.status(200).json({ therapists });
});
