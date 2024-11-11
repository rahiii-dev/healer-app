import jwt from "jsonwebtoken";
import environment from '../config/environment.js';

const JWT_SECRET = environment.JWT_SECRET;
const JWT_EXPIRATION = "1h";

// Generates a JWT token for a given payload.
export function generateToken(payload, expiresIn = JWT_EXPIRATION) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

// Verifies a JWT token and decodes it.
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Middleware function to extract token from headers.
export function getTokenFromHeaders(req) {
  const authorizationHeader = req.headers.authorization || "";
  if (authorizationHeader.startsWith("Bearer ")) {
    return authorizationHeader.split(" ")[1];
  }
  return null;
}
