import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BlogController } from "../controllers/blogController";

const Create = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState(null);
  const history = useHistory();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (!user) throw new Error("Please login to create a blog");
      await BlogController.create({ title, body });
      history.push("/");
    } catch (err) {
      setError(err.message || "Failed to create blog");
    }
  };

  return (
    <div className="create">
      <h2>Add a New Blog</h2>
      {error && <div style={{ color: "#f1356d" }}>{error}</div>}
      <form onSubmit={handleSubmit}>
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
          <small>
            Author: <strong>{user ? user.name : "—"}</strong>
          </small>
        </div>
        <button style={{ marginTop: 12 }}>Add Blog</button>
      </form>
    </div>
  );
};

export default Create;
