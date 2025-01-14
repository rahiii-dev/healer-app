import mongoose from "mongoose";

// Admin Profile
const adminProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactInfo: { type: String },
});

// Therapist Profile
const therapistProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qualification: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: Number, min: 0 },
  bio: { type: String },
});

export const TherapistProfile = mongoose.model(
  "TherapistProfile",
  therapistProfileSchema
);

// User Profile
export const USER_GENDERS = Object.freeze({
  'MALE': "male",
  'FEMALE': "female",
  'Other': "other",
});

const userProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { 
    type: String, 
    required: false, 
    enum: Object.values(USER_GENDERS), 
    lowercase: true 
  },
  age: {
    type: Number,
    required: false, 
    min: 0, 
    max: 120 
  }
});

export const UserProfile = mongoose.model("UserProfile", userProfileSchema);
