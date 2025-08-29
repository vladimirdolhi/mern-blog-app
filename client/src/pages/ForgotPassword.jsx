import { useState } from "react";
import { AuthController } from "../controllers/authController";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await AuthController.forgot(email);
      setSent(true);
    } catch (e2) {
      setSent(true);
    }
  };

  return (
    <div className="create" style={{ maxWidth: 400 }}>
      <h2>Reset your password</h2>
      {sent ? (
        <p>Check your email for a link to reset your password.</p>
      ) : (
        <form onSubmit={onSubmit}>
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button>Send reset link</button>
        </form>
      )}
      {error && <div style={{ color: "#f1356d", marginTop: 10 }}>{error}</div>}
    </div>
  );
};

export default ForgotPassword;
