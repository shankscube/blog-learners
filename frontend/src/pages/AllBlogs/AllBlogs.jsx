import { useEffect, useState } from "react";
import axios from "axios";

import Header from "../../components/header/Header";
import Posts from "../../components/posts/Posts";

import { getAllPosts } from "../../service/api";

import "./allBlogs.css";

export default function AllBlogs() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("blog-token");

  const getAllBlogPosts = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("TOKEN:", token);
      const res = await axios.get(getAllPosts, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("ALL BLOGS RESPONSE:", res.data);

      setData(res.data.data || []);
    } catch (error) {
      console.error("GET ALL BLOGS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load blogs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBlogPosts();
  }, []);

  return (
    <>
      <Header />

      <main className="allBlogs">
        {/* Page Header */}
        <section className="allBlogsHeader">
          <span className="allBlogsTag">EXPLORE</span>

          <h1>All Articles</h1>

          <p>
            Discover stories, ideas, knowledge and perspectives from our
            community.
          </p>
        </section>

        {/* Blog Content */}
        <section className="allBlogsContent">
          {loading && (
            <div className="blogsLoading">
              <div className="loadingSpinner"></div>

              <p>Loading articles...</p>
            </div>
          )}

          {!loading && error && (
            <div className="blogsError">
              <p>{error}</p>

              <button onClick={getAllBlogPosts}>Try Again</button>
            </div>
          )}

          {!loading && !error && data.length === 0 && (
            <div className="noBlogs">
              <div className="emptyIcon">📝</div>

              <h2>No articles yet</h2>

              <p>There are no published articles available right now.</p>
            </div>
          )}

          {!loading && !error && data.length > 0 && (
            <>
              <div className="blogsCount">
                <span>
                  {data.length} {data.length === 1 ? "Article" : "Articles"}
                </span>
              </div>

              <Posts data={data} />
            </>
          )}
        </section>
      </main>
    </>
  );
}
