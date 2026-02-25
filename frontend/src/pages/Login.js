import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/AuthApi";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

// 1. Import both the background and the new logo
import krmuImage from "../assets/krmu-hd.jpg";
import campusLogo from "../assets/campus-logo.png"; // Ensure the logo is in your assets folder

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
      if (res.data.role === "admin") navigate("/admin");
      else if (res.data.role === "placement") navigate("/placements");
      else navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="campus-viewport">
      <div className="campus-fullscreen-card">
        
        {/* LEFT SECTION: FORM */}
        <div className="campus-form-side">
          
          {/* UPDATED BRAND SECTION WITH LOGO */}
          <div className="campus-brand">
            <img src={campusLogo} alt="Campus Connect Logo" className="campus-logo-img" />
            <div className="campus-brand-text">
              <span className="text-main">Campus</span>
              <span className="text-sub">connect</span>
            </div>
          </div>
          
          <div className="campus-content-box">
            <h2 className="campus-welcome">Welcome Back</h2>
            <h4 className="campus-subtitle">Official KRMU Campus Connect Portal</h4>

            {error && <div className="campus-error-alert">{error}</div>}

            <form onSubmit={handleSubmit} className="campus-main-form">
              <div className="campus-input-field">
                <label>University Email</label>
                <input 
                  type="email" 
                  placeholder="university.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>

              <div className="campus-input-field">
                <label>Password</label>
                <div className="campus-password-wrapper">
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                  <i className="bi bi-eye-fill campus-eye-icon"></i>
                </div>
              </div>

              <div className="campus-extra-actions">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="remember" />
                  <label className="form-check-label" htmlFor="remember">Remember me</label>
                </div>
                <Link to="/forgot" className="forgot-link">Forgot Password?</Link>
              </div>

              <button type="submit" className="campus-submit-btn">Submit Credentials</button>
            </form>

            <div className="campus-or-divider"><span>Or Sign in with</span></div>

            <div className="campus-social-group">
              <button className="campus-social-item">
                <i className="bi bi-google"></i> Google
              </button>
              <button className="campus-social-item">
                <i className="bi bi-github"></i> Github
              </button>
            </div>

            <div className="campus-form-footer">
              <Link to="/register" className="register-link">Need access? <span>Register here</span></Link>
              <Link to="/" className="back-link">Back to website →</Link>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION: IMAGE PANE */}
        <div className="campus-visual-side">
          <div 
            className="campus-image-inset"
            style={{ 
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), url(${krmuImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
             <div className="campus-overlay-text">
                <h3>Empowering Careers,</h3>
                <h3 className="fw-bold">Connecting Campus.</h3>
                <p>Official Placement & Training Portal of K.R. Mangalam University.</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;