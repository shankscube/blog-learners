const postMiddleware = (req, res, next) => {
  console.log("post Middleware executed");
  next();
};

module.exports = postMiddleware;
