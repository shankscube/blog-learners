const Post = require("./Post");
const User = require("./User");

Post.belongsTo(User, {
  foreignKey: "author_id",
  as: "author",
});
