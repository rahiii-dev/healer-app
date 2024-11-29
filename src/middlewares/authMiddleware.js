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