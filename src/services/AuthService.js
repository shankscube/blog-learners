const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.createUser = async (userData = {}) => {
  const {
    username,
    email,
    password,
    phone,
    date_of_birth,
    gender,
    user_type,
    country,
    state,
    city,
    profile_image,
  } = userData;

  if (!username || !email || !password) {
    throw new Error("Username, email and password are required");
  }

  const existingEmail = await User.findOne({
    where: {
      email,
    },
  });

  if (existingEmail) {
    throw new Error("Email already registered");
  }

  const existingUsername = await User.findOne({
    where: {
      username,
    },
  });

  if (existingUsername) {
    throw new Error("Username already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password_hash: passwordHash,
    phone,
    date_of_birth,
    gender,
    user_type,
    country,
    state,
    city,
    profile_image,

    is_verified: 0,
    is_active: 1,
    is_login: 0,

    created_at: new Date(),
    updated_at: new Date(),
  });

  return user;
};
