const { DataTypes, Model } = require("sequelize");
const sequelize = require("../configs/database");

class PostLike extends Model {}

PostLike.init(
  {
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "post_likes",
    modelName: "PostLike",
    timestamps: false,
  }
);

module.exports = PostLike;
