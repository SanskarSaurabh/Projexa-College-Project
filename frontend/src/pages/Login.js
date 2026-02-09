import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/AuthApi";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });
      login(res.data);

      // Redirect based on the specific departments you mentioned
      if (res.data.role === "admin") navigate("/admin");
      else if (res.data.role === "placement") navigate("/placements");
      else navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-viewport d-flex align-items-center justify-content-center">
      <div className="main-login-container container-fluid p-0 overflow-hidden shadow-2xl">
        <div className="row g-0 h-100">
          
          {/* 🌌 LEFT SIDE: THE VISUAL PANE */}
          <div className="col-lg-6 d-none d-lg-block position-relative visual-pane">
            <div className="overlay-content p-5 d-flex flex-column justify-content-between h-100">
              <div className="brand-logo">KRMU <span className="text-indigo-glow">CONNECT</span></div>
              <div className="visual-footer">
                <h3 className="text-white fw-light mb-2">Empowering Careers,</h3>
                <h3 className="text-white fw-bold">Connecting Campus.</h3>
                <p className="text-silver-muted small mt-2">Manage placements, share updates, and streamline approvals.</p>
                <div className="mini-carousel-indicators mt-4">
                  <span className="dot active"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            </div>
          </div>

          {/* 📝 RIGHT SIDE: THE FORM PANE */}
          <div className="col-lg-6 form-pane p-5 d-flex flex-column justify-content-center">
            <div className="form-content mx-auto w-100" style={{ maxWidth: "400px" }}>
              <div className="text-end mb-4">
                <Link to="/" className="back-link">Back to website →</Link>
              </div>

              <h2 className="text-white mb-1">Welcome Back</h2>
              <p className="text-silver mb-4 small">Official KRMU Campus Connect Portal</p>

              {error && <div className="alert alert-custom py-2 mb-3">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control login-input"
                    placeholder="University Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3 position-relative">
                  <input
                    type="password"
                    className="form-control login-input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <i className="bi bi-eye-fill password-eye"></i>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input className="form-check-input custom-check" type="checkbox" id="remember" />
                    <label className="form-check-label text-silver small" htmlFor="remember">Remember me</label>
                  </div>
                  <Link to="/forgot" className="text-silver small text-decoration-none">Forgot Password?</Link>
                </div>

                {/* 🚀 THE SUBMIT BUTTON */}
                <button type="submit" className="btn btn-submit-indigo w-100 py-2 mb-4">
                  Submit Credentials
                </button>
              </form>

              <div className="divider text-silver small mb-4"><span>Or Sign in with</span></div>

              <div className="row g-2 mb-4">
                <div className="col-6">
                  <button className="btn btn-outline-social w-100 small">
                    <i className="bi bi-google me-2"></i> Google
                  </button>
                </div>
                <div className="col-6">
                  <button className="btn btn-outline-social w-100 small">
                    <i className="bi bi-apple me-2"></i> Apple
                  </button>
                </div>
              </div>

              <p className="text-center text-silver small mt-2">
                Need access? <Link to="/register" className="text-indigo-glow fw-bold text-decoration-none">Register here</Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;