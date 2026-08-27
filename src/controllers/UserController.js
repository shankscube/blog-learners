const UserService = require('../services/UserService');

exports.getAllUsers = async (request, response, next) => {
  try{
      const users = await UserService.getAllUsers();
      response.json(users);
  } catch (error) {
    next(error);
  }
}
