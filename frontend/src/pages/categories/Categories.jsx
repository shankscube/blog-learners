import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./categories.css";
import { createCategory } from "../../service/api";

export default function CreateCategory() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("");

  const [loading, setLoading] = useState(false);

  const createSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-");
  };

  const handleNameChange = (e) => {
    const value = e.target.value;

    setName(value);

    // Automatically create slug from name
    setSlug(createSlug(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter category name");
      return;
    }

    if (!slug.trim()) {
      alert("Please enter category slug");
      return;
    }

    if (!description.trim()) {
      alert("Please enter category description");
      return;
    }

    try {
      setLoading(true);

      const categoryData = {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        parent_id: parentId ? Number(parentId) : null,
      };

      console.log("CREATE CATEGORY REQUEST:", categoryData);

      const res = await axios.post(createCategory, categoryData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("CREATE CATEGORY RESPONSE:", res.data);

      if (res.data.status) {
        alert("Category created successfully");

        setName("");
        setSlug("");
        setDescription("");
        setParentId("");

        // If you have category listing page
        // navigate("/categories");
      } else {
        alert(res.data.message || "Failed to create category");
      }
    } catch (error) {
      console.error("CREATE CATEGORY ERROR:", error);

      if (error.response) {
        console.error("STATUS:", error.response.status);

        console.error("DATA:", error.response.data);

        alert(error.response.data?.message || "Failed to create category");
      } else {
        alert("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="createCategory">
      <div className="createCategoryWrapper">
        <h1 className="createCategoryTitle">Create Category</h1>

        <p className="createCategorySubtitle">
          Add a new category for your blog posts.
        </p>

        <form className="createCategoryForm" onSubmit={handleSubmit}>
          {/* Category Name */}
          <div className="categoryFormGroup">
            <label>Category Name</label>

            <input
              type="text"
              placeholder="Example: Cooking"
              value={name}
              onChange={handleNameChange}
            />
          </div>

          {/* Slug */}
          <div className="categoryFormGroup">
            <label>Slug</label>

            <input
              type="text"
              placeholder="Example: cooking"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />

            {slug && <small className="slugHelp">URL: /cat={slug}</small>}
          </div>

          {/* Description */}
          <div className="categoryFormGroup">
            <label>Description</label>

            <textarea
              placeholder="Example: Cooking related posts"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Parent Category */}
          <div className="categoryFormGroup">
            <label>Parent Category ID</label>

            <input
              type="number"
              placeholder="Leave empty for main category"
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
            />

            <small className="fieldHelp">
              Leave this empty if this is a top-level category.
            </small>
          </div>

          {/* Submit */}
          <button type="submit" className="categorySubmit" disabled={loading}>
            {loading ? "Creating..." : "Create Category"}
          </button>
        </form>
      </div>
    </div>
  );
}
