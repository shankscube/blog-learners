const UserService = require('../services/UserService');
const { responseOk, responseIssues } = require('../utils/responder');

exports.getAllUsers = async (request, response, next) => {
  try{
      const users = await UserService.getAllUsers();
      if(!users || users.length === 0){
        return responseIssues(response, "USER_NOT_FOUND");
      }
      return responseOk(response, "USERS_FOUND", users);
  } catch (error) {
    return responseIssues(response, "SERVER_ERROR");
  }
}
