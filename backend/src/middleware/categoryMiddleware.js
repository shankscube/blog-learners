const categoryMiddleware = (req, res, next) => {
  console.log("category Middleware executed");
  next();
};

module.exports = categoryMiddleware;
