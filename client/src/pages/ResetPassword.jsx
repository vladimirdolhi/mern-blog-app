import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AuthController } from "../controllers/authController";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPassword = () => {
  const q = useQuery();
  const history = useHistory();
  const token = q.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [ok, setOk] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    try {
      await AuthController.reset(token, password);
      setOk(true);
      setTimeout(() => history.push("/login"), 1200);
    } catch (e2) {
      setError(e2.message || "Failed to reset password");
    }
  };

  if (!token) {
    return (
      <div className="create" style={{ maxWidth: 400 }}>
        <h2>Invalid link</h2>
        <p>Missing reset token.</p>
      </div>
    );
  }

  return (
    <div className="create" style={{ maxWidth: 400 }}>
      <h2>Set a new password</h2>
      {ok ? (
        <p>Password updated! Redirecting to login…</p>
      ) : (
        <form onSubmit={onSubmit}>
          <label>New password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Confirm new password</label>
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <button>Change password</button>
        </form>
      )}
      {error && <div style={{ color: "#f1356d", marginTop: 10 }}>{error}</div>}
    </div>
  );
};

export default ResetPassword;
