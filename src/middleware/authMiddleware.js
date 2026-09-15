const authMiddleware = (req, res, next) => {
  console.log("Middleware executed");
  next();
};

module.exports = authMiddleware;
