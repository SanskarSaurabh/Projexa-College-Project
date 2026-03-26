import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Login.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const load = toast.loading("Updating password...");

    try {
      const res = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });

      toast.success(res.data.message || "Password updated!", { id: load });

      navigate("/login");

    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired link", { id: load });
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
              <h2>Reset Password</h2>
              <p>Enter your new password</p>
            </div>

            <form onSubmit={handleSubmit} className="az-form">

              <div className="az-input-group">
                <i className="bi bi-lock-fill"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="az-pass-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </span>
              </div>

              <button type="submit" className="az-btn-primary">
                Update Password
              </button>

            </form>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;