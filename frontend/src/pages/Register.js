import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/AuthApi";
import "./Register.css"; // Reusing the high-fidelity styles for consistency

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await registerUser({ name, email, password });
      setMessage(res.data.message || "Registration successful!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="login-viewport d-flex align-items-center justify-content-center">
      <div className="main-login-container container-fluid p-0 overflow-hidden shadow-2xl">
        <div className="row g-0 h-100">
          
          {/* 🌌 LEFT SIDE: VISUAL PANE */}
          <div className="col-lg-6 d-none d-lg-block position-relative visual-pane">
            <div className="overlay-content p-5 d-flex flex-column justify-content-between h-100">
              <div className="brand-logo">KRMU <span className="text-indigo-glow">CONNECT</span></div>
              <div className="visual-footer">
                <h3 className="text-white fw-light mb-2">Join the Network,</h3>
                <h3 className="text-white fw-bold">Build Your Future.</h3>
                <p className="text-silver-muted small mt-2">Create an account to access placement opportunities and campus updates.</p>
                <div className="mini-carousel-indicators mt-4">
                  <span className="dot"></span>
                  <span className="dot active"></span>
                  <span className="dot"></span>
                </div>
              </div>
            </div>
          </div>

          {/* 📝 RIGHT SIDE: FORM PANE */}
          <div className="col-lg-6 form-pane p-5 d-flex flex-column justify-content-center">
            <div className="form-content mx-auto w-100" style={{ maxWidth: "400px" }}>
              <div className="text-end mb-4">
                <Link to="/" className="back-link">Back to login →</Link>
              </div>

              <h2 className="text-white mb-1">Create Account</h2>
              <p className="text-silver mb-4 small">Join the official KRMU Campus Connect ecosystem.</p>

              {message && <div className="alert alert-success py-2 mb-3 small bg-opacity-10 text-success border-success">{message}</div>}
              {error && <div className="alert alert-custom py-2 mb-3">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control login-input"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

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

                <div className="mb-4 position-relative">
                  <input
                    type="password"
                    className="form-control login-input"
                    placeholder="Create Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <i className="bi bi-shield-lock-fill password-eye"></i>
                </div>

                <button type="submit" className="btn btn-submit-indigo w-100 py-2 mb-4">
                  Create Account
                </button>
              </form>

              <div className="divider text-silver small mb-4"><span>Or register with</span></div>

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
                Already registered? <Link to="/" className="text-indigo-glow fw-bold text-decoration-none">Sign in here</Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;