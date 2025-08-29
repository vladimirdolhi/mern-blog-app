import { useState } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const [email, setEmail] = useState("example@example.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const from = (location.state && location.state.from) || { pathname: "/" };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      history.replace(from);
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="create" style={{ maxWidth: 400 }}>
      <h2>Login</h2>
      {error && <div style={{ color: "#f1356d" }}>{error}</div>}
      <form onSubmit={onSubmit}>
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
        <button>Login</button>
      </form>
      <p style={{ marginTop: 12 }}>
        No account? <Link to="/register">Register</Link>
      </p>
      <p style={{ marginTop: 12 }}>
        <Link to="/forgot">Forgot password?</Link>
      </p>
    </div>
  );
};

export default Login;
