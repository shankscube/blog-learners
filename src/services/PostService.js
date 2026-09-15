const Post = require("../models/Post");
const PostComment = require("../models/PostComment");
const PostLike = require("../models/PostLike");
const { Sequelize } = require("sequelize");
// CREATE POST
exports.createPost = async (postData) => {
  const {
    author_id,
    category_id,
    title,
    slug,
    summary,
    content,
    featured_image_url,
    status,
  } = postData;

  if (!author_id) {
    throw new Error("Author ID is required");
  }

  if (!title) {
    throw new Error("Post title is required");
  }

  if (!slug) {
    throw new Error("Post slug is required");
  }

  if (!content) {
    throw new Error("Post content is required");
  }

  // Check duplicate slug
  const existingPost = await Post.findOne({
    where: {
      slug,
    },
  });

  if (existingPost) {
    throw new Error("Post slug already exists");
  }

  const post = await Post.create({
    author_id,
    category_id: category_id || null,
    title,
    slug,
    summary: summary || null,
    content,
    featured_image_url: featured_image_url || null,
    status: status || "draft",
    published_at: new Date(),
  });
  return post;
};

// GET ALL POSTS
exports.getPosts = async () => {
  const posts = await Post.findAll({
    attributes: {
      include: [
        [
          Sequelize.literal(`(
            SELECT COUNT(*)
            FROM post_likes AS likes
            WHERE likes.post_id = Post.id
          )`),
          "likes_count",
        ],

        [
          Sequelize.literal(`(
            SELECT COUNT(*)
            FROM post_comments AS comments
            WHERE comments.post_id = Post.id
          )`),
          "comments_count",
        ],
      ],
    },
    order: [["id", "DESC"]],
  });
  return posts;
};

// GET POST BY ID
exports.getPostById = async (id) => {
  const post = await Post.findByPk(id, {
    attributes: {
      include: [
        [
          Sequelize.literal(`(
            SELECT COUNT(*)
            FROM post_likes AS likes
            WHERE likes.post_id = Post.id
          )`),
          "likes_count",
        ],
        [
          Sequelize.literal(`(
            SELECT COUNT(*)
            FROM post_comments AS comments
            WHERE comments.post_id = Post.id
          )`),
          "comments_count",
        ],
      ],
    },
  });
  if (!post) {
    throw new Error("Post not found");
  }
  return post;
};

// UPDATE POST
exports.updatePost = async (id, postData) => {
  const post = await Post.findByPk(id);
  if (!post) {
    throw new Error("Post not found");
  }
  const {
    category_id,
    title,
    slug,
    summary,
    content,
    featured_image_url,
    status,
  } = postData;

  // Check duplicate slug
  if (slug && slug !== post.slug) {
    const existingPost = await Post.findOne({
      where: {
        slug,
      },
    });
    if (existingPost) {
      throw new Error("Post slug already exists");
    }
  }

  if (category_id !== undefined) {
    post.category_id = category_id;
  }
  if (title !== undefined) {
    post.title = title;
  }
  if (slug !== undefined) {
    post.slug = slug;
  }
  if (summary !== undefined) {
    post.summary = summary;
  }
  if (content !== undefined) {
    post.content = content;
  }
  if (featured_image_url !== undefined) {
    post.featured_image_url = featured_image_url;
  }
  if (status !== undefined) {
    post.status = status;
  }
  await post.save();
  return post;
};

// DELETE POST
exports.deletePost = async (id) => {
  const post = await Post.findByPk(id);
  if (!post) {
    throw new Error("Post not found");
  }
  await post.destroy();
  return post;
};

// Create comment
exports.createComment = async (postId, commentData) => {
  const { user_id, content, parent_id } = commentData;

  if (!user_id) {
    throw new Error("User ID is required");
  }

  if (!content) {
    throw new Error("Comment content is required");
  }

  // Check post exists
  const post = await Post.findByPk(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  const comment = await PostComment.create({
    post_id: postId,
    user_id,
    content,
    parent_id: parent_id || null,
    created_at: new Date(),
  });

  return comment;
};

// Like post
exports.likePost = async (postId, userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  const post = await Post.findByPk(postId);
  if (!post) {
    throw new Error("Post not found");
  }
  const existingLike = await PostLike.findOne({
    where: {
      post_id: postId,
      user_id: userId,
    },
  });
  if (existingLike) {
    throw new Error("Post already liked");
  }
  const like = await PostLike.create({
    post_id: postId,
    user_id: userId,
    created_at: new Date(),
  });

  return like;
};

// Unlike post
exports.unlikePost = async (postId, userId) => {
  const like = await PostLike.findOne({
    where: {
      post_id: postId,
      user_id: userId,
    },
  });

  if (!like) {
    throw new Error("Post is not liked by this user");
  }

  await like.destroy();

  return like;
};

// Delete comment
exports.deleteComment = async (commentId) => {
  const comment = await PostComment.findByPk(commentId);

  if (!comment) {
    throw new Error("Comment not found");
  }
  await comment.destroy();

  return comment;
};
