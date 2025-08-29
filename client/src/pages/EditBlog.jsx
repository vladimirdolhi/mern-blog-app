import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { BlogController } from "../controllers/blogController";
import { useAuth } from "../context/AuthContext";

const FIVE_MIN = 5 * 60 * 1000;

const EditBlog = () => {
  const { id } = useParams();
  const history = useHistory();
  const { user } = useAuth();

  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await BlogController.get(id);
        if (!mounted) return;

        const ownerId = data.user._id;
        const isOwner = user && ownerId === user.id;
        const withinWindow =
          data.createdAt &&
          Date.now() - new Date(data.createdAt).getTime() <= FIVE_MIN;

        if (!isOwner || !withinWindow) {
          history.replace(`/blogs/${id}`);
          return;
        }

        setBlog(data);
        setTitle(data.title);
        setBody(data.body);
        setError(null);
      } catch (e) {
        setError(e.message || "Failed to load blog");
      } finally {
        setIsPending(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, user, history]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!blog) return;
    setError(null);
    try {
      await BlogController.update(blog._id, { title, body }, user.id);
      history.push(`/blogs/${blog._id}`);
    } catch (e2) {
      setError(e2.message || "Failed to update blog");
    }
  };

  return (
    <div className="create">
      <h2>Edit Blog</h2>
      {isPending && <div>Loading...</div>}
      {error && <div style={{ color: "#f1356d" }}>{error}</div>}
      {blog && (
        <form onSubmit={onSubmit}>
          <label>Blog title:</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label>Blog body:</label>
          <textarea
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div style={{ textAlign: "left", marginTop: 10 }}>
            <small>Created: {new Date(blog.createdAt).toLocaleString()}</small>
          </div>
          <button style={{ marginTop: 12 }}>Save changes</button>
          <button
            type="button"
            style={{ marginTop: 12, marginLeft: 8 }}
            onClick={() => history.goBack()}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default EditBlog;
