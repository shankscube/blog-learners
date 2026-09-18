import { useEffect, useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./singlePost.css";
import axios from "axios";
import { format } from "timeago.js";

import { Context } from "../../context/Context";
import { mypost, likePost, commentPost, deletePost } from "../../service/api";

export default function SinglePost() {
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useContext(Context);

  const token = localStorage.getItem("blog-token");

  // URL: /post/6
  const path = location.pathname.split("/")[2];

  const [post, setPost] = useState({});

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");

  const [updateMode, setUpdateMode] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await axios.get(`${mypost}/${path}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("SINGLE POST RESPONSE:", res.data);

        const postData = res.data.data;

        setPost(postData);

        setLikes(Number(postData.likes_count) || 0);

        setComments(postData.comments || []);

        setLiked(postData.is_liked || false);
      } catch (error) {
        console.error("GET SINGLE POST ERROR:", error);
      }
    };

    if (path) {
      getPost();
    }
  }, [path]);

  /* =========================
     Populate Update Fields
  ========================= */

  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      setSummary(post.summary || "");
      setContent(post.content || "");
    }
  }, [post]);

  /* =========================
     Like Post
  ========================= */

  const handleLike = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (likeLoading) return;

    try {
      setLikeLoading(true);

      const res = await axios.post(
        likePost(post.id),
        {
          user_id: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("LIKE RESPONSE:", res.data);

      /*
       * For now we update the UI based on
       * the action.
       *
       * Once you send me the API response,
       * we can use the exact backend values.
       */

      if (!liked) {
        setLikes((prev) => prev + 1);
        setLiked(true);
      } else {
        setLikes((prev) => Math.max(0, prev - 1));
        setLiked(false);
      }
    } catch (error) {
      console.error("LIKE POST ERROR:", error);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      return;
    }

    const token = localStorage.getItem("blog-token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!user?.id) {
      console.error("Logged-in user ID not found");
      return;
    }

    try {
      setCommentLoading(true);

      const res = await axios.post(
        commentPost(post.id),
        {
          user_id: user.id,
          content: commentText.trim(),
          parent_id: null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("COMMENT RESPONSE:", res.data);

      // If API returns the newly created comment
      if (res.data?.data) {
        setComments((prev) => [...prev, res.data.data]);
      }

      setCommentText("");
    } catch (error) {
      console.error("COMMENT ERROR:", error.response?.data || error.message);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(deletePost(post.id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/");
    } catch (error) {
      console.error("DELETE POST ERROR:", error);
    }
  };

  /* =========================
     Update Post
  ========================= */

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `${mypost}/${post.id}`,
        {
          title,
          summary,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("UPDATE RESPONSE:", res.data);

      if (res.data.data) {
        setPost(res.data.data);
      } else {
        setPost({
          ...post,
          title,
          summary,
          content,
        });
      }

      setUpdateMode(false);
    } catch (error) {
      console.error("UPDATE POST ERROR:", error);
    }
  };

  return (
    <div className="singlePost">
      <div className="singlePostWrapper">
        {/* =========================
            Featured Image
        ========================= */}

        {post.featured_image_url && (
          <img
            className="singlePostImg"
            src={post.featured_image_url}
            alt={post.title}
          />
        )}

        {/* =========================
            Category
        ========================= */}

        {post.category_id && (
          <Link
            className="singlePostCategory"
            to={`/posts?cat=${post.category_id}`}
          >
            Article
          </Link>
        )}

        {/* =========================
            Title
        ========================= */}

        {updateMode ? (
          <input
            type="text"
            value={title}
            className="singlePostTitleInput"
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <div className="singlePostTitleRow">
            <h1 className="singlePostTitle">{post.title}</h1>

            {/* Edit / Delete */}

            {user && user.id === post.author_id && (
              <div className="singlePostEdit">
                <button
                  className="singlePostEditButton"
                  onClick={() => setUpdateMode(true)}
                >
                  ✏️ Edit
                </button>

                <button
                  className="singlePostDeleteButton"
                  onClick={handleDelete}
                >
                  🗑 Delete
                </button>
              </div>
            )}
          </div>
        )}

        {/* =========================
            Post Info
        ========================= */}

        <div className="singlePostInfo">
          <div className="singlePostAuthorInfo">
            <div className="singlePostAvatar">
              {(post.username || "A").charAt(0).toUpperCase()}
            </div>

            <div>
              <span className="authorLabel">Written by</span>

              <span className="singlePostAuthor">
                {post.username ||
                  post.author?.username ||
                  `Author #${post.author_id}`}
              </span>
            </div>
          </div>

          <span className="singlePostDate">
            {post.created_at ? format(post.created_at) : ""}
          </span>
        </div>

        {/* =========================
            Engagement Bar
        ========================= */}

        {!updateMode && (
          <div className="singlePostEngagement">
            <button
              className={`singlePostLikeButton ${liked ? "liked" : ""}`}
              onClick={handleLike}
              disabled={likeLoading}
            >
              <span className="singlePostLikeIcon">{liked ? "♥" : "♡"}</span>

              <span>
                {likes} {likes === 1 ? "Like" : "Likes"}
              </span>
            </button>

            <button
              className="singlePostCommentCount"
              onClick={() => {
                document.getElementById("comments")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              <span>💬</span>

              <span>
                {comments.length}{" "}
                {comments.length === 1 ? "Comment" : "Comments"}
              </span>
            </button>
          </div>
        )}

        {/* =========================
            Summary
        ========================= */}

        {updateMode ? (
          <textarea
            className="singlePostDescInput"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Post summary"
          />
        ) : (
          <p className="singlePostDesc">{post.summary}</p>
        )}

        {/* =========================
            Content
        ========================= */}

        {updateMode ? (
          <textarea
            className="singlePostContentInput"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Post content"
          />
        ) : (
          <p className="singlePostContent">{post.content}</p>
        )}

        {/* =========================
            Update
        ========================= */}

        {updateMode && (
          <div className="updateActions">
            <button className="singlePostButton" onClick={handleUpdate}>
              Update Post
            </button>

            <button
              className="cancelButton"
              onClick={() => setUpdateMode(false)}
            >
              Cancel
            </button>
          </div>
        )}

        {/* =========================
            Comments
        ========================= */}

        {!updateMode && (
          <section id="comments" className="commentsSection">
            <div className="commentsHeader">
              <h2>Comments</h2>

              <span>{comments.length}</span>
            </div>

            {/* Add Comment */}

            {user ? (
              <form className="commentForm" onSubmit={handleComment}>
                <div className="commentAvatar">
                  {user.username?.charAt(0).toUpperCase() || "U"}
                </div>

                <div className="commentInputWrapper">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    rows="3"
                  />

                  <div className="commentFormFooter">
                    <span>Share your thoughts</span>

                    <button
                      type="submit"
                      disabled={commentLoading || !commentText.trim()}
                    >
                      {commentLoading ? "Posting..." : "Post Comment"}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="loginToComment">
                <p>Login to join the conversation.</p>

                <Link to="/login">Login</Link>
              </div>
            )}

            {/* Comments List */}

            <div className="commentsList">
              {comments.length === 0 ? (
                <div className="noComments">
                  <span>💬</span>

                  <h3>No comments yet</h3>

                  <p>Be the first to share your thoughts.</p>
                </div>
              ) : (
                comments.map((comment, index) => (
                  <div className="commentItem" key={comment.id || index}>
                    <div className="commentAvatar">
                      {(comment.username || "U").charAt(0).toUpperCase()}
                    </div>

                    <div className="commentBody">
                      <div className="commentTop">
                        <span className="commentAuthor">
                          {comment.username || "Anonymous"}
                        </span>

                        {comment.created_at && (
                          <span className="commentDate">
                            {format(comment.created_at)}
                          </span>
                        )}
                      </div>

                      <p>{comment.comment || comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
