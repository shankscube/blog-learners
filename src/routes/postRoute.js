const express = require("express");

const postMiddleware = require("../middleware/postMiddleware");
const postController = require("../controllers/PostController");

const router = express.Router();

router.post("/createPost", postMiddleware, postController.createPost);

router.get("/getPost", postMiddleware, postController.getPosts);

router.get("/getPost/:id", postMiddleware, postController.getPostById);

router.put("/edit/:id", postMiddleware, postController.updatePost);

router.delete("/deletepost/:id", postMiddleware, postController.deletePost);

// Comments
router.post("/comment/:id", postMiddleware, postController.createComment);
router.delete("/comment/:id", postMiddleware, postController.deleteComment);

// Likes
router.post("/like/:id", postMiddleware, postController.likePost);
router.delete("/like/:id", postMiddleware, postController.unlikePost);

module.exports = router;
