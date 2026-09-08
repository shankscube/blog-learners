const UserService = require('../services/UserService');
const { writeLog } = require('../utils/logger');
const { responseOk, responseIssues } = require('../utils/responder');

exports.getAllUsers = async (request, response, next) => {
  try{
      const users = await UserService.getAllUsers();
      if(!users || users.length === 0){
        return responseIssues(response, "USER_NOT_FOUND");
      }
      writeLog(`Fetched all users successfully. Total users: ${users.length}\n`);

      writeLog(`This is to test the custom logging\n`, 'CUSTOM', 'payment_logs');
      return responseOk(response, "USERS_FOUND", users);
  } catch (error) {
    writeLog(`Error in getAllUsers: ${error.message}\n`);
    return responseIssues(response, "SERVER_ERROR");
  }
}

exports.createUser = async (request, response, next) => {
  try{
    console.log(request.body);
    const user = await UserService.createUser(request.body);
    if(!user){
      return responseIssues(response, "USER_CREATION_FAILED");
    }
    return responseOk(response, "USER_CREATED", user);
  } catch (error) {
    writeLog(`Error in createUser: ${error.message}\n`);
    return responseIssues(response, "SERVER_ERROR");
  }
}
