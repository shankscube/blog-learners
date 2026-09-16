const UserService = require("../services/userService");
const { responseIssues, responseOk } = require("../utils/responder");
const logger = require("../utils/logger");

exports.getAllUsers = async (request, response, next) => {
  try {
    const users = await UserService.getAllUsers();
    if (!users || users.length === 0) {
      logger.warn("USER_NOT_FOUND:");
      return responseIssues(response, "USER_NOT_FOUND");
    }
    logger.info("USERS_FOUND:", users);
    return responseOk(response, "USERS_FOUND", users);
  } catch (error) {
    logger.error("Get users error:", error);
    return responseIssues(response, "SERVER_ERROR");
  }
};

exports.getUserDetails = async (request, response, next) => {
  try {
    const user = await UserService.getUserDetailsById(request.params.id);
    if (!user || user.length === 0) {
      logger.warn("USER_NOT_FOUND:");
      return responseIssues(response, "USER_NOT_FOUND");
    }
    logger.info("USER_FOUND:", user);
    return responseOk(response, "USER_FOUND", user);
  } catch (error) {
    logger.error("Get user by id error:", error);
    return responseIssues(response, "SERVER_ERROR");
  }
};
