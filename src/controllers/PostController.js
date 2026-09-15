const postService = require("../services/PostService");
const logger = require("../utils/logger");
const { responseIssues, responseOk } = require("../utils/responder");

exports.createPost = async (request, response) => {
  try {
    const post = await postService.createPost(request.body);
    logger.info("Post created successfully", {
      postId: post.id,
      title: post.title,
      authorId: post.author_id,
    });
    return responseOk(response, "POST_CREATED", post);
  } catch (error) {
    logger.error("Create post error", {
      message: error.message,
    });
    return responseIssues(response, "SERVER_ERROR");
  }
};

exports.getPosts = async (request, response) => {
  try {
    const posts = await postService.getPosts();
    logger.info("Posts fetched successfully", {
      count: posts.length,
    });
    return responseOk(response, "POSTS_FOUND", posts);
  } catch (error) {
    logger.error("Get posts error", {
      message: error.message,
    });
    return responseIssues(response, "SERVER_ERROR");
  }
};

exports.getPostById = async (request, response) => {
  try {
    const post = await postService.getPostById(request.params.id);
    logger.info("Post found successfully", {
      postId: post.id,
    });
    return responseOk(response, "POST_FOUND", post);
  } catch (error) {
    logger.error("Get post by id error", {
      message: error.message,
    });
    return responseIssues(response, "SERVER_ERROR");
  }
};

exports.updatePost = async (request, response) => {
  try {
    const post = await postService.updatePost(request.params.id, request.body);
    logger.info("Post updated successfully", {
      postId: post.id,
      title: post.title,
    });
    return responseOk(response, "POST_UPDATED", post);
  } catch (error) {
    logger.error("Update post error", {
      message: error.message,
    });
    return responseIssues(response, "SERVER_ERROR");
  }
};

exports.deletePost = async (request, response) => {
  try {
    const post = await postService.deletePost(request.params.id);
    logger.info("Post deleted successfully", {
      postId: post.id,
      title: post.title,
    });
    return responseOk(response, "POST_DELETED", post);
  } catch (error) {
    logger.error("Delete post error", {
      message: error.message,
    });
    return responseIssues(response, "SERVER_ERROR");
  }
};

exports.createComment = async (request, response) => {
  try {
    const comment = await postService.createComment(
      request.params.id,
      request.body
    );
    logger.info("Comment created successfully", {
      commentId: comment.id,
      postId: comment.post_id,
      userId: comment.user_id,
    });
    return responseOk(response, "COMMENT_CREATED", comment);
  } catch (error) {
    logger.error("Create comment error", {
      message: error.message,
    });
    return responseIssues(response, "SERVER_ERROR");
  }
};

exports.likePost = async (request, response) => {
  try {
    const like = await postService.likePost(
      request.params.id,
      request.body.user_id
    );
    logger.info("Post liked successfully", {
      postId: like.post_id,
      userId: like.user_id,
    });
    return responseOk(response, "POST_LIKED", like);
  } catch (error) {
    logger.error("Like post error", {
      message: error.message,
    });
    return responseIssues(response, "SERVER_ERROR");
  }
};

exports.unlikePost = async (request, response) => {
  try {
    const like = await postService.unlikePost(
      request.params.id,
      request.body.user_id
    );
    logger.info("Post unliked successfully", {
      postId: like.post_id,
      userId: like.user_id,
    });
    return responseOk(response, "POST_UNLIKED", like);
  } catch (error) {
    logger.error("Unlike post error", {
      message: error.message,
    });
    return responseIssues(response, "SERVER_ERROR");
  }
};

exports.deleteComment = async (request, response) => {
  try {
    const comment = await postService.deleteComment(request.params.id);
    logger.info("Comment deleted successfully", {
      commentId: comment.id,
      postId: comment.post_id,
    });
    return responseOk(response, "COMMENT_DELETED", comment);
  } catch (error) {
    logger.error("Delete comment error", {
      message: error.message,
    });
    return responseIssues(response, "SERVER_ERROR");
  }
};
