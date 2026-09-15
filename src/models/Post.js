const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../configs/database");

class Post extends Model {}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },

    featured_image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("draft", "published", "scheduled", "archived"),
      allowNull: false,
      defaultValue: "draft",
    },

    published_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "posts",
    modelName: "Post",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Post;
