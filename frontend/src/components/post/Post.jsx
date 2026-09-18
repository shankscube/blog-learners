import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { format } from "timeago.js";

import "./post.css";

import { likePost, commentPost } from "../../service/api";

export default function Post({
  id,
  category_id,
  title,
  featured_image_url,
  summary,
  created_at,
  username,
  author,
  likes_count,
  comments_count,
  is_liked,
}) {
  const navigate = useNavigate();
  const [likeLoading, setLikeLoading] = useState(false);

  const authorName = username || author?.username || "Anonymous";

  const handleLike = async (e) => {
    // Prevent opening the post
    e.preventDefault();
    e.stopPropagation();

    if (likeLoading) return;

    const token = localStorage.getItem("blog-token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLikeLoading(true);

      await axios.post(
        likePost(id),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("LIKE POST ERROR:", error);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleComment = (e) => {
    e.preventDefault();
    e.stopPropagation();

    navigate(`/post/${id}`);
  };

  return (
    <article className="post">
      {/* Image */}
      <Link to={`/post/${id}`} className="postImageLink">
        {featured_image_url ? (
          <img
            className="postImg"
            src={featured_image_url}
            alt={title}
            loading="lazy"
          />
        ) : (
          <div className="postImagePlaceholder">
            <span>B</span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="postContent">
        {/* Category */}
        <div className="postCats">
          <Link className="postCat" to={`/posts?cat=${category_id}`}>
            Article
          </Link>
        </div>

        {/* Title */}
        <h2 className="postTitle">
          <Link to={`/post/${id}`}>{title}</Link>
        </h2>

        {/* Summary */}
        {summary && <p className="postDesc">{summary}</p>}

        {/* Footer */}
        <div className="postFooter">
          {/* Author */}
          <div className="postMeta">
            <div className="authorAvatar">
              {authorName.charAt(0).toUpperCase()}
            </div>

            <div className="postMetaText">
              <span className="authorName">{authorName}</span>

              <span className="postDate">
                {created_at ? format(created_at) : ""}
              </span>
            </div>
          </div>

          {/* Engagement */}
          <div className="postEngagement">
            {/* Like */}
            <div
              className={`engagementButton ${is_liked ? "liked" : ""}`}
              title={is_liked ? "Unlike" : "Like"}
            >
              <span className="engagementIcon">{is_liked ? "♥" : "♡"}</span>

              <span>{likes_count}</span>
            </div>

            {/* Comment */}
            <div className="engagementButton">
              <span className="engagementIcon">💬</span>

              <span>{comments_count}</span>
            </div>
          </div>
        </div>

        {/* Read Article */}
        <Link to={`/post/${id}`} className="readMore">
          Read article →
        </Link>
      </div>
    </article>
  );
}
