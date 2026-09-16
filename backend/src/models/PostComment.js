const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../configs/database");
class PostComment extends Model {}

PostComment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "post_comments",
    modelName: "PostComment",
    timestamps: false,
  }
);

module.exports = PostComment;
