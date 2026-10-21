
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // JWT payload se user ID nikalo
    const userId = decoded.userId || decoded.id || decoded._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID missing from token. Please login again.",
      });
    }

    req.userId = userId;

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
};

export default authMiddleware;
