import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const history = useHistory();

  const doLogout = async () => {
    try {
      await logout();
    } finally {
      history.push("/");
    }
  };

  return (
    <nav className="navbar">
      <h1>The Dojo Blog</h1>
      <div className="links">
        <Link to="/">Home</Link>

        {user ? (
          <>
            <Link
              to="/create"
              style={{
                color: "white",
                backgroundColor: "#f1356d",
                borderRadius: "8px",
              }}
            >
              New Blog
            </Link>
            <span style={{ marginLeft: 16 }}>Hi, {user.name}</span>
            <button style={{ marginLeft: 16 }} onClick={doLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link
              to="/register"
              style={{
                color: "white",
                backgroundColor: "#f1356d",
                borderRadius: "8px",
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
