import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

export const PROFILE_ROLES = Object.freeze({
    'admin': "admin",
    'user': "user",
    'therapist': "therapist",
});

export const PROFILE_MODALS = Object.freeze({
    'admin': "AdminProfile",
    'user': "UserProfile",
    'therapist': "TherapistProfile",
});

export const DEFAULT_USER_IMAGE = "https://res.cloudinary.com/dnirajbb5/image/upload/v1731346022/healer/defaultAvatar.png";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(PROFILE_ROLES), 
      required: true,
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "profileModel", 
    },
    profileModel: {
      type: String,
      required: true,
      enum: Object.values(PROFILE_MODALS), 
    },
    image: { 
        type: String,
        default: DEFAULT_USER_IMAGE
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Middleware to hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); 
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); 
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
