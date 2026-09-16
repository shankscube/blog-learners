import { useLocation } from "react-router";
import Header from "../../components/header/Header";
import Posts from "../../components/posts/Posts";
import Sidebar from "../../components/sidebar/Sidebar";
import { getAllPosts } from "../../service/api";
import "./homepage.css";
import axios from "axios";
import { useEffect, useState } from "react";
export default function Homepage() {
  const location = useLocation();
  const [data, setData] = useState([]);
  async function getAllPost() {
    try {
      const res = await axios.get(getAllPosts);
      console.log("ALL POSTS RESPONSE:", res.data);
      setData(res.data.data);
    } catch (error) {
      console.error("GET POSTS ERROR:", error);
    }
  }
  useEffect(() => {
    getAllPost();
  }, []);
  return (
    <>
      <Header />
      <div className="home">
        <Posts data={data} />
        {/* <Sidebar /> */}
      </div>
    </>
  );
}
