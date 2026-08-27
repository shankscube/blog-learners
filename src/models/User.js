const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize  = require('../configs/database');

class User extends Model {}

User.init(
  {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: true },
    gender: { type: DataTypes.STRING, allowNull: true }
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    timestamps: true
  },
);

module.exports = User;