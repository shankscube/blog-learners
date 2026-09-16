import { Link } from "react-router-dom";
import "./post.css";
import { format } from "timeago.js";

export default function Post({
  id,
  category_id,
  title,
  featured_image_url,
  summary,
  created_at,
}) {
  return (
    <div className="post">
      {featured_image_url && (
        <img className="postImg" src={featured_image_url} alt={title} />
      )}

      <div className="postInfo">
        <div className="postCats">
          <span className="postCat">
            <Link className="link" to={`/posts?cat=${category_id}`}>
              Category
            </Link>
          </span>
        </div>

        <span className="postTitle">
          <Link to={`/post/${id}`} className="link">
            {title}
          </Link>
        </span>

        <hr />

        <span className="postDate">{format(created_at)}</span>
      </div>

      <p className="postDesc">{summary}</p>
    </div>
  );
}
