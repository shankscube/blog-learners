const authService = require("../services/authService");
const logger = require("../utils/logger");
const { responseOk, responseIssues } = require("../utils/responder");

exports.Login = (req, res) => {
  res.json({
    message: "Login data",
  });
};

exports.Signup = async (request, response) => {
  console.log("Signup request body:", request.body); // Log the request body for debugging
  try {
    const user = await authService.createUser(request.body);

    logger.info("User created successfully", {
      userId: user.id,
      username: user.username,
      email: user.email,
    });
    return responseOk(
      response,
      "USER_CREATED",
      (data = {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        date_of_birth: user.date_of_birth,
        gender: user.gender,
        user_type: user.user_type,
        country: user.country,
        state: user.state,
        city: user.city,
        profile_image: user.profile_image,
        is_verified: user.is_verified,
        is_active: user.is_active,
      })
    );
  } catch (error) {
    logger.error("User creation failed", {
      message: error.message,
    });
    return responseIssues(response, "USER_FAILED");
  }
};
