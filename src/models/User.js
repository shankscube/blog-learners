const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../configs/database");

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    user_type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Readers",
    },

    profile_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    is_login: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "app_users",
    modelName: "User",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = User;
