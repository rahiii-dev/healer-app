export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: You are not an admin" });
  }
  next();
};

export const isTherapist = (req, res, next) => {
  if (req.user.role !== "therapist") {
    return res
      .status(403)
      .json({ message: "Forbidden: You are not a therapist" });
  }
  next();
};
