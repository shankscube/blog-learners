import { useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import "./singlePost.css";
import axios from "axios";
import { format } from "timeago.js";
import { Context } from "../../context/Context";
import { mypost } from "../../service/api";

export default function SinglePost() {
  const location = useLocation();
  const { user } = useContext(Context);

  const token = localStorage.getItem("blog-token");

  // URL: /post/6
  const path = location.pathname.split("/")[2];

  const [post, setPost] = useState({});
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [updateMode, setUpdateMode] = useState(false);

  // Change this according to your local backend

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await axios.get(`${mypost}/${path}`);

        console.log("SINGLE POST RESPONSE:", res.data);

        // Your API response:
        // {
        //   status: true,
        //   message: "...",
        //   code: "...",
        //   data: {...}
        // }

        setPost(res.data.data);
      } catch (error) {
        console.error("GET SINGLE POST ERROR:", error);
      }
    };

    if (path) {
      getPost();
    }
  }, [path]);

  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      setSummary(post.summary || "");
      setContent(post.content || "");
    }
  }, [post]);

  console.log("POST:", post);
  console.log("USER:", user);

  const handleDelete = async () => {
    try {
      await axios.delete(`${mypost}/${post.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      window.location.replace("/");
    } catch (error) {
      console.error("DELETE POST ERROR:", error);
    }
  };

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

      // Update local state
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
        {/* Featured Image */}
        {post.featured_image_url && (
          <img
            className="singlePostImg"
            src={post.featured_image_url}
            alt={post.title}
          />
        )}

        {/* Title */}
        {updateMode ? (
          <input
            type="text"
            value={title}
            className="singlePostTitleInput"
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <h1 className="singlePostTitle">
            {post.title}

            {/* Edit / Delete */}
            {user && user.id === post.author_id && (
              <div className="singlePostEdit">
                <i
                  className="singlePostIcon far fa-edit"
                  onClick={() => setUpdateMode(true)}
                >
                  Edit
                </i>

                <i
                  className="singlePostIcon far fa-trash-alt"
                  onClick={handleDelete}
                >
                  Delete
                </i>
              </div>
            )}
          </h1>
        )}

        {/* Post Info */}
        <div className="singlePostInfo">
          <span>
            Author ID: <b className="singlePostAuthor">{post.author_id}</b>
          </span>

          <span>{post.created_at ? format(post.created_at) : ""}</span>
        </div>

        {/* Summary */}
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

        {/* Content */}
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

        {/* Update button */}
        {updateMode && (
          <button className="singlePostButton" onClick={handleUpdate}>
            Update
          </button>
        )}
      </div>
    </div>
  );
}
