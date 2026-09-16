const User = require("../models/User");

exports.getAllUsers = async () => {
  return await User.findAll();
};

exports.getUserDetailsById = async (id) => {
  console.log("getUserDetailsById called with id:", id);
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
