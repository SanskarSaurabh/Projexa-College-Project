import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./Login.css"; // reuse same design

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const load = toast.loading("Sending reset link...");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });

      toast.success(res.data.message || "Link sent!", { id: load });

      navigate("/login");

    } catch (err) {
      toast.error(err.response?.data?.message || "Error", { id: load });
    }
  };

  return (
    <div className="auth-zone-wrapper">
      <div className="az-blob az-blob-1"></div>
      <div className="az-blob az-blob-2"></div>
      <div className="az-blob az-blob-3"></div>

      <main className="auth-zone-main">
        <div className="az-card-container">
          <div className="az-card">

            <div className="az-intro">
              <h2>Forgot Password</h2>
              <p>Enter your email to receive reset link</p>
            </div>

            <form onSubmit={handleSubmit} className="az-form">
              <div className="az-input-group">
                <i className="bi bi-envelope-at-fill"></i>
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button type="submit" className="az-btn-primary">
                Send Reset Link
              </button>
            </form>

            <div className="az-signup-prompt">
              <Link to="/login">Back to Login</Link>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;