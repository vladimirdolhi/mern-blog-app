import { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("example@example.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register({ name, email, password });
      history.replace("/");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="create" style={{ maxWidth: 400 }}>
      <h2>Register</h2>
      {error && <div style={{ color: "#f1356d" }}>{error}</div>}
      <form onSubmit={onSubmit}>
        <label>Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Create account</button>
      </form>
      <p style={{ marginTop: 12 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
