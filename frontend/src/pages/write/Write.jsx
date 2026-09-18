import { useContext, useEffect, useState } from "react";
import { Context } from "../../context/Context";
import "./write.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createPost, getAllCategories } from "../../service/api";

export default function Write() {
  const navigate = useNavigate();
  const { user } = useContext(Context);

  const token = localStorage.getItem("blog-token");

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [status, setStatus] = useState("draft");

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // =========================
  // GET CATEGORIES
  // =========================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(getAllCategories);

        console.log("CATEGORY RESPONSE:", res.data);

        setCategories(res.data.data || []);
      } catch (error) {
        console.error("CATEGORY ERROR:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // =========================
  // CREATE SLUG
  // =========================
  const createSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-");
  };

  // =========================
  // SUBMIT POST
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (!title.trim()) {
      alert("Please enter post title");
      return;
    }

    if (!categoryId) {
      alert("Please select a category");
      return;
    }

    if (!summary.trim()) {
      alert("Please enter post summary");
      return;
    }

    if (!content.trim()) {
      alert("Please enter post content");
      return;
    }

    try {
      setSubmitting(true);

      const newPost = {
        author_id: user.id,
        category_id: Number(categoryId),
        title: title.trim(),
        slug: createSlug(title),
        summary: summary.trim(),
        content: content.trim(),
        featured_image_url: featuredImageUrl.trim() || null,
        status,
      };

      console.log("CREATE POST REQUEST:", newPost);

      const res = await axios.post(createPost, newPost, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("CREATE POST RESPONSE:", res.data);

      if (res.data.status) {
        alert("Post has been added successfully");
        navigate("/");
      } else {
        alert(res.data.message || "Failed to create post");
      }
    } catch (error) {
      console.error("CREATE POST ERROR:", error);

      if (error.response) {
        console.error("STATUS:", error.response.status);
        console.error("DATA:", error.response.data);

        alert(error.response.data?.message || "Failed to create post");
      } else {
        alert("Something went wrong");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="write">
      <div className="writeWrapper">
        <h1 className="writeHeading">Create New Post</h1>

        <p className="writeSubHeading">
          Share your thoughts, ideas and stories with your readers.
        </p>

        <form className="writeForm" onSubmit={handleSubmit}>
          {/* IMAGE URL */}
          <div className="writeFormGroup">
            <label className="writeLabel">Featured Image</label>

            <input
              className="writeInput"
              type="text"
              placeholder="Enter image URL"
              value={featuredImageUrl}
              onChange={(e) => setFeaturedImageUrl(e.target.value)}
            />

            {featuredImageUrl && (
              <img
                className="writeImg"
                src={featuredImageUrl}
                alt="Preview"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>

          {/* TITLE */}
          <div className="writeFormGroup">
            <label className="writeLabel">Title</label>

            <input
              className="writeInput"
              placeholder="Enter post title"
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* SLUG PREVIEW */}
          {title && (
            <div className="slugPreview">
              <span>Slug:</span>
              <strong>{createSlug(title)}</strong>
            </div>
          )}

          {/* CATEGORY */}
          <div className="writeFormGroup">
            <label className="writeLabel">Category</label>

            <select
              className="writeSelect"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={loadingCategories}
            >
              <option value="">
                {loadingCategories
                  ? "Loading categories..."
                  : "Select a category"}
              </option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* SUMMARY */}
          <div className="writeFormGroup">
            <label className="writeLabel">Summary</label>

            <textarea
              className="writeInput writeSummary"
              placeholder="Write a short summary of your post..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          {/* CONTENT */}
          <div className="writeFormGroup">
            <label className="writeLabel">Content</label>

            <textarea
              className="writeInput writeText"
              placeholder="Tell your story..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* STATUS */}
          <div className="writeFormGroup">
            <label className="writeLabel">Post Status</label>

            <select
              className="writeSelect"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="draft">Draft</option>

              <option value="published">Published</option>

              <option value="scheduled">Scheduled</option>
            </select>
          </div>

          {/* BUTTON */}
          <button className="writeSubmit" type="submit" disabled={submitting}>
            {submitting ? "Publishing..." : "Publish Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
