import Post from "../post/Post";
import "./posts.css";

export default function Posts({ data }) {
  console.log("data in posts", data);

  return (
    <div className="posts">
      {data.map((el) => (
        <Post key={el.id} {...el} />
      ))}
    </div>
  );
}
