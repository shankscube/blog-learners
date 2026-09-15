const userMiddleware = (req, res, next) => {
  console.log("User Middleware executed");
  next();
};

module.exports = userMiddleware;
