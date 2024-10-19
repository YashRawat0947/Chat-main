import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.token; // Check for the token in cookies
  console.log('Received token:', token); // Log the token

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Unauthorized - no token provided" 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('Token verification error:', err); // Log the error
      return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
    }

    req.userId = decoded.userId; // Attach userId to request
    next(); // Proceed to the next middleware
  });
};
