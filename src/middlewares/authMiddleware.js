import { PROFILE_ROLES } from "../models/UserModal.js";
import { getTokenFromHeaders, verifyToken } from "../utils/jwt.js";

export const isAuthenticated = (req, res, next) => {
    const token = getTokenFromHeaders(req);
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
  
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  
    req.user = decoded; 
    next();
};

export const isVerified = (req, res, next) => {
  if(!req.user.isVerified){
    return res
      .status(403)
      .json({ message: "Forbidden: You are not a verified" });
  }

  next()
}


export const AccessTo = (...roles) => {
  const allowedRoles = Object.values(PROFILE_ROLES);
  const invalidRoles = roles.filter((role) => !allowedRoles.includes(role));
  if (invalidRoles.length > 0) {
    throw new Error(`Invalid roles provided for restriction: ${invalidRoles.join(", ")}`);
  }

  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: You do not have permission to perform this action." });
    }

    next();
  };
};
