import { Link } from "react-router-dom";
import StarRating from "./StarRating";

const fmt = (iso) =>
  new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso || Date.now()));

const BlogList = ({ blogs }) => {
  return (
    <div className="blog-list">
      {blogs.map((blog) => {
        const avg = Number(blog.ratingAvg || 0);
        const count = Number(blog.ratingCount || 0);
        return (
          <div className="blog-preview" key={blog._id}>
            <Link to={`/blogs/${blog._id}`}>
              <h2>{blog.title}</h2>
              {blog.createdAt && (
                <small>Published: {fmt(blog.createdAt)}</small>
              )}
              <div style={{ marginTop: 6 }}>
                <StarRating value={avg} readOnly />
                <small style={{ marginLeft: 8 }}>
                  {count ? `${avg.toFixed(1)} (${count})` : "No ratings"}
                </small>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default BlogList;
