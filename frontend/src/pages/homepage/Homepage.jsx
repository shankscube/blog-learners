import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Header from "../../components/header/Header";
import Posts from "../../components/posts/Posts";

import { getAllPosts } from "../../service/api";

import "./homepage.css";

export default function Homepage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("blog-token");
  async function getAllPost() {
    try {
      const res = await axios.get(getAllPosts, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("ALL POSTS RESPONSE:", res.data);

      setData(res.data.data || []);
    } catch (error) {
      console.error("GET POSTS ERROR:", error);

      console.log("STATUS:", error.response?.status);
      console.log("BACKEND ERROR:", error.response?.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllPost();
  }, []);

  const latestPosts = data.slice(0, 3);

  return (
    <>
      <Header />

      <main className="homepage">
        {/* ================= HERO ================= */}

        <section className="heroSection">
          <div className="heroContent">
            <span className="heroTag">WELCOME TO OUR BLOG</span>

            <h1>
              Stories, Ideas &<span> Inspiration.</span>
            </h1>

            <p>
              Discover interesting stories, useful knowledge, and fresh
              perspectives from our community of writers.
            </p>

            <div className="heroActions">
              <Link to="/blogs" className="heroPrimaryButton">
                Explore Articles
              </Link>

              <Link to="/write" className="heroSecondaryButton">
                Start Writing
              </Link>
            </div>
          </div>

          <div className="heroDecoration">
            <div className="heroCircle">B</div>
          </div>
        </section>

        {/* ================= LATEST POSTS ================= */}

        <section className="latestSection">
          <div className="sectionHeader">
            <div>
              <span className="sectionTag">FROM THE BLOG</span>

              <h2>Latest Articles</h2>

              <p>Explore our latest stories and insights.</p>
            </div>

            <Link to="/posts" className="desktopViewAll">
              View All →
            </Link>
          </div>

          {/* Posts */}

          {loading ? (
            <div className="loading">Loading articles...</div>
          ) : data.length === 0 ? (
            <div className="emptyPosts">No articles available yet.</div>
          ) : (
            <>
              <Posts data={latestPosts} />

              <div className="mobileViewAll">
                <Link to="/posts">View All Blogs →</Link>
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
}
