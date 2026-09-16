const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

exports.loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.is_active) {
    throw new Error("User account is inactive");
  }

  const passwordMatch = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );

  // user.is_login = 1;
  // user.updated_at = new Date();

  await user.save();

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      user_type: user.user_type,
      is_verified: user.is_verified,
      is_active: user.is_active,
    },
    access_token: token,
  };
};

exports.createUser = async (userData = {}) => {
  const {
    username,
    email,
    password,
    phone,
    user_type,
    // date_of_birth,
    // gender,
    // country,
    // state,
    // city,
    // profile_image,
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
    date_of_birth: userData.date_of_birth,
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
