const jwt = require("jsonwebtoken");

const authMiddleware = (request, response, next) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return response.status(401).json({
        success: false,
        message: "Authorization token is required",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return response.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("JWT decoded:", decoded);

    request.user = decoded;

    next();
  } catch (error) {
    console.log("JWT error:", error.message);

    return response.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;
