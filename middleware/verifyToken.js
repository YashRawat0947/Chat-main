import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.token; 
  console.log('Received token:', token); 

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Unauthorized - no token provided" 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('Token verification error:', err); 
      return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
    }

    req.userId = decoded.userId; 
    next(); 
  });
};
